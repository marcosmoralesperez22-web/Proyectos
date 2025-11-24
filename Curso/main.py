from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController
from ursina.shaders import lit_with_shadows_shader
import random
import math
import wave
import struct
import os

# --- Audio Synthesis ---
def generate_sound(name, duration, freq_start, freq_end, volume=0.5, type='sine'):
    if os.path.exists(f'{name}.wav'): return
    
    sample_rate = 44100
    n_samples = int(sample_rate * duration)
    
    with wave.open(f'{name}.wav', 'w') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        
        for i in range(n_samples):
            t = i / n_samples
            freq = freq_start + (freq_end - freq_start) * t
            
            if type == 'sine':
                value = math.sin(2 * math.pi * freq * (i / sample_rate))
            elif type == 'noise':
                value = random.uniform(-1, 1)
            elif type == 'saw':
                value = 2 * (freq * (i / sample_rate) - math.floor(0.5 + freq * (i / sample_rate)))
            
            env = 1.0
            if t < 0.1: env = t / 0.1
            if t > 0.8: env = (1 - t) / 0.2
            
            data = struct.pack('<h', int(value * 32767 * volume * env))
            w.writeframesraw(data)

generate_sound('shoot', 0.2, 800, 200, 0.3, 'saw')
generate_sound('jump', 0.3, 200, 400, 0.3, 'sine')
generate_sound('explosion', 0.5, 100, 50, 0.5, 'noise')
generate_sound('roar', 1.0, 100, 300, 0.6, 'saw')
generate_sound('step', 0.1, 100, 50, 0.2, 'noise')
generate_sound('powerup', 0.5, 400, 800, 0.4, 'sine')

# --- Game Setup ---
app = Ursina()
window.title = "Post Mortem: Vengeance - Village Edition"
window.borderless = False
window.fullscreen = False
window.exit_button.visible = False
window.fps_counter.enabled = False

# --- Global State ---
game_state = 'menu' 
player_color = color.azure
boss_active = False

# --- Classes ---

class Player(FirstPersonController):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.health = 100
        self.speed = 14 # Slightly faster
        self.jump_height = 18 # Higher jump
        self.gravity = 0.6 # Floatier gravity
        self.air_control = 0.5 # Better air control
        
        self.gun = Entity(parent=self.camera_pivot, model='cube', scale=(0.2, 0.2, 0.5), position=(0.5, -0.25, 0.5), color=player_color, on_cooldown=False)
        self.muzzle_flash = Entity(parent=self.gun, model='quad', scale=0.5, position=(0, 0, 0.6), color=color.yellow, enabled=False, billboard=True)

    def shoot(self):
        if not self.gun.on_cooldown:
            self.gun.on_cooldown = True
            self.gun.animate_position((0.5, -0.2, 0.4), duration=0.1, curve=curve.linear)
            invoke(self.gun.animate_position, (0.5, -0.25, 0.5), duration=0.1, delay=0.1)
            invoke(setattr, self.gun, 'on_cooldown', False, delay=0.2)
            
            Audio('shoot.wav')
            Projectile(position=self.camera_pivot.world_position, direction=self.camera_pivot.forward, color=self.gun.color)
            
            self.muzzle_flash.enabled = True
            invoke(setattr, self.muzzle_flash, 'enabled', False, delay=0.05)

    def input(self, key):
        if self.hp <= 0 or game_state != 'playing': return
        super().input(key)
        if key == 'left mouse down':
            self.shoot()
        if key == 'space':
            if self.grounded: Audio('jump.wav')

    def update(self):
        if self.hp <= 0 or game_state != 'playing': return
        super().update()
        if self.y < -10: self.hp = 0 

    @property
    def hp(self):
        return self.health

    @hp.setter
    def hp(self, value):
        self.health = value
        if hud_health: hud_health.value = value
        if self.health <= 0:
            game_over(False)

class Projectile(Entity):
    def __init__(self, position, direction, color):
        super().__init__(
            model='sphere',
            scale=0.3,
            color=color,
            position=position + direction,
            collider='box'
        )
        self.direction = direction
        self.speed = 50
        self.damage = 10
        self.duration = 2
        invoke(self.destroy_self, delay=self.duration)

    def update(self):
        self.position += self.direction * self.speed * time.dt
        hit_info = self.intersects()
        if hit_info.hit:
            if hit_info.entity == boss and boss.enabled:
                boss.take_damage(self.damage)
                create_particles(self.position, self.color)
                Audio('explosion.wav', pitch=1.5)
            elif hit_info.entity != player:
                create_particles(self.position, color.gray)
            
            self.destroy_self()

    def destroy_self(self):
        if self: destroy(self)

class Boss(Entity):
    def __init__(self):
        super().__init__(
            model='dodecahedron',
            color=color.rgb(50, 50, 50),
            scale=3,
            position=(0, 10, 0),
            collider='box',
            shader=lit_with_shadows_shader,
            enabled=False # Starts hidden
        )
        self.head = Entity(parent=self, model='cube', scale=0.6, position=(0, 0.8, 0), color=color.rgb(30,30,30))
        self.eye_l = Entity(parent=self.head, model='sphere', scale=0.2, position=(-0.2, 0.2, 0.4), color=color.red, always_on_top=True)
        self.eye_r = Entity(parent=self.head, model='sphere', scale=0.2, position=(0.2, 0.2, 0.4), color=color.red, always_on_top=True)
        
        self.max_health = 1000
        self.health = self.max_health
        self.phase = 1
        self.speed = 4
        self.state = 'chase'
        self.target = player
        self.attack_cooldown = 0

    def take_damage(self, amount):
        self.health -= amount
        if hud_boss: hud_boss.value = self.health
        self.blink(color.red)
        if self.health <= 0:
            self.die()

    def update(self):
        if game_state != 'playing' or not self.enabled or not self.target: return
        
        dist = distance(self, self.target)
        self.look_at_2d(self.target)
        
        if self.health < 300 and self.phase != 3:
            self.phase = 3
            self.color = color.red
            self.speed = 10
            Audio('roar.wav', pitch=0.8)
        elif self.health < 700 and self.phase == 1:
            self.phase = 2
            self.speed = 7
            Audio('roar.wav')

        if self.state == 'chase':
            self.position += self.forward * self.speed * time.dt
            ray = raycast(self.position, (0,-1,0), distance=2, ignore=(self,))
            if not ray.hit:
                self.y -= 10 * time.dt
            else:
                self.y = ray.world_point.y + 1.5

            if dist < 5:
                self.state = 'attack'
                self.attack_cooldown = 1

        elif self.state == 'attack':
            self.attack_cooldown -= time.dt
            if self.attack_cooldown <= 0:
                self.attack()
                self.state = 'chase'

        if self.y < -20: 
            self.position = (0, 10, 0)

    def attack(self):
        if self.phase == 3:
            rock = Entity(model='dodecahedron', scale=1, position=self.position + (0,2,0), color=color.brown, collider='sphere')
            rock.animate_position(self.target.position, duration=1, curve=curve.linear)
            invoke(destroy, rock, delay=2)
            invoke(self.damage_player, 20, delay=1)
        else:
            self.animate_y(self.y + 5, duration=0.2, curve=curve.out_quad)
            invoke(self.animate_y, self.y, duration=0.1, delay=0.2, curve=curve.in_quad)
            invoke(self.shockwave, delay=0.3)

    def shockwave(self):
        create_particles(self.position, color.orange, 20)
        Audio('explosion.wav')
        if distance(self, self.target) < 8:
            self.target.hp -= 15
            self.target.position += (self.target.position - self.position).normalized() * 5

    def damage_player(self, amount):
        if distance(self, self.target) < 3:
            self.target.hp -= amount

    def die(self):
        create_particles(self.position, color.red, 50)
        Audio('roar.wav', pitch=0.5)
        destroy(self)
        game_over(True)

def create_particles(position, color, count=8):
    for i in range(count):
        e = Entity(model='cube', scale=0.2, position=position, color=color, collider=None)
        e.animate_position(position + Vec3(random.uniform(-1,1), random.uniform(0,1), random.uniform(-1,1))*2, duration=0.5)
        e.animate_scale(0, duration=0.5)
        invoke(destroy, e, delay=0.5)

class NPC(Entity):
    def __init__(self, position):
        super().__init__(
            model='capsule',
            color=color.blue,
            position=position,
            scale=1.5,
            collider='box'
        )
        self.text_bubble = Text(
            text="¡Hola! Soy Franco.\nEscucha esta música procedural.\n¡La hice yo con código!",
            parent=scene,
            position=position + (0, 2.5, 0),
            billboard=True,
            origin=(0,0),
            scale=2,
            color=color.black,
            background=True,
            enabled=False
        )
    
    def update(self):
        if not player: return
        if distance(self, player) < 5:
            self.text_bubble.enabled = True
            self.look_at_2d(player)
        else:
            self.text_bubble.enabled = False

class BossButton(Entity):
    def __init__(self, position):
        super().__init__(
            model='cylinder',
            color=color.red,
            scale=(2, 0.2, 2),
            position=position,
            collider='box'
        )
        self.label = Text("INVOCAR JEFE", parent=self, y=2, billboard=True, color=color.red, scale=2, origin=(0,0))
        
    def update(self):
        if not player or boss_active: return
        if distance(self, player) < 3:
            self.color = color.green
            if held_keys['e']: # Interaction key
                self.activate()
        else:
            self.color = color.red

    def activate(self):
        global boss_active
        boss_active = True
        boss.enabled = True
        boss.position = (0, 20, 0)
        Audio('powerup.wav')
        self.label.text = "¡CORRE!"
        self.label.color = color.red
        hud_boss.enabled = True
        Text("¡SUA HA DESPERTADO!", origin=(0,0), scale=3, color=color.red, duration=3)

# --- UI ---
class Menu(Entity):
    def __init__(self):
        super().__init__(parent=camera.ui)
        self.main_panel = Entity(parent=self, enabled=True)
        
        Text("POST MORTEM: VENGEANCE", parent=self.main_panel, y=0.4, x=0, origin=(0,0), scale=3, color=color.orange)
        Text("Village Edition", parent=self.main_panel, y=0.3, x=0, origin=(0,0), scale=2, color=color.azure)
        
        self.preview_guy = Entity(model='cube', scale=(1,2,1), color=player_color, rotation=(0,45,0), y=0.1)
        
        Text("Editor de Personaje", parent=self.main_panel, y=0.25, x=-0.4)
        self.r_slider = Slider(0, 255, default=0, text='R', parent=self.main_panel, x=-0.6, y=0.2, on_value_changed=self.update_color)
        self.g_slider = Slider(0, 255, default=128, text='G', parent=self.main_panel, x=-0.6, y=0.15, on_value_changed=self.update_color)
        self.b_slider = Slider(0, 255, default=255, text='B', parent=self.main_panel, x=-0.6, y=0.1, on_value_changed=self.update_color)
        
        Button("JUGAR", parent=self.main_panel, y=-0.2, scale=(0.2, 0.1), color=color.green, on_click=start_game)
        Button("SALIR", parent=self.main_panel, y=-0.35, scale=(0.2, 0.1), color=color.gray, on_click=application.quit)

    def update_color(self):
        global player_color
        c = color.rgb(self.r_slider.value, self.g_slider.value, self.b_slider.value)
        self.preview_guy.color = c
        player_color = c

    def hide(self):
        self.main_panel.enabled = False
        self.preview_guy.enabled = False

# --- Environment ---
def generate_map():
    # Sky
    window.color = color.sky
    scene.fog_color = color.sky
    scene.fog_density = 0.01

    # Floor (Grass)
    Entity(model='plane', scale=200, color=color.rgb(50, 200, 50), texture='grass', texture_scale=(50,50), collider='box')
    
    # Walls (Mountains)
    for i in range(4):
        e = Entity(model='cube', scale=(200, 50, 1), color=color.rgb(100, 100, 100), collider='box')
        e.x = 100 if i==0 else -100 if i==1 else 0
        e.z = 100 if i==2 else -100 if i==3 else 0
        if i > 1: e.rotation_y = 90
        
    # Houses
    for _ in range(30):
        x = random.randint(-80, 80)
        z = random.randint(-80, 80)
        if abs(x) < 20 and abs(z) < 20: continue 
        
        # House Body
        h_color = random.choice([color.red, color.blue, color.yellow, color.orange])
        body = Entity(model='cube', position=(x, 2, z), scale=(4, 4, 4), 
               color=h_color, texture='brick', collider='box', shader=lit_with_shadows_shader)
        
        # Roof
        Entity(model='cone', position=(x, 5, z), scale=(5, 2, 5), color=color.brown, collider='box')

    # Easter Egg
    tomb = Entity(model='cube', position=(40, 1, -40), scale=(1, 2, 0.5), color=color.gray, collider='box')
    Text("R.I.P Post Mortem", parent=tomb, scale=2, color=color.black, z=-0.51, y=0.2, origin=(0,0))
    Entity(model='sphere', position=(40, 0.5, -38), scale=0.5, color=color.gold, collider='box')

    # Lights
    PointLight(parent=scene, position=(0, 50, 0), color=color.white, shadows=True)
    AmbientLight(color=color.rgb(150,150,150))

# --- Game Logic ---
player = None
boss = None
menu = None
hud_health = None
hud_boss = None
game_over_text = None

def start_game():
    global game_state, player, boss, hud_health, hud_boss, boss_active
    menu.hide()
    game_state = 'playing'
    boss_active = False
    
    player = Player(position=(0, 2, 20))
    player.gun.color = player_color
    
    boss = Boss() # Spawns disabled
    
    # NPC Franco
    NPC(position=(10, 1, 10))
    
    # Boss Button
    BossButton(position=(0, 0.1, 0))
    
    # HUD
    hud_health = HealthBar(bar_color=color.green, roundness=0.5, value=100, position=(-0.85, -0.45))
    Text("MARCOS", position=(-0.85, -0.4), scale=1)
    
    hud_boss = HealthBar(bar_color=color.red, roundness=0.5, max_value=1000, value=1000, position=(0.85, -0.45), enabled=False)
    Text("SUA", position=(0.85, -0.4), scale=1, enabled=False) # We can't easily toggle Text enabled without ref, so just leave it or recreate.
    
    Text("Presiona 'E' en el botón rojo para invocar al jefe", origin=(0,0), y=0.4, scale=1.5, duration=5)

def game_over(win):
    global game_state, game_over_text
    game_state = 'gameover'
    mouse.locked = False
    mouse.visible = True
    
    msg = "VICTORIA" if win else "HAS MUERTO"
    col = color.gold if win else color.red
    
    game_over_text = Text(msg, origin=(0,0), scale=4, color=col, background=True)
    Button("REINTENTAR", y=-0.2, scale=(0.2, 0.1), color=color.gray, on_click=restart_game)

def restart_game():
    global game_state
    for e in scene.entities:
        if e != camera and e != window.render_node:
            destroy(e)
    
    if game_over_text: destroy(game_over_text)
    
    generate_map()
    start_game()

# --- Run ---
menu = Menu()
generate_map()

app.run()
