import tkinter as tk
from tkinter import messagebox
import random
import math

# Juego "Post Mortem: Vengeance" - Versión 2D
# Sin dependencias externas, solo usa tkinter (incluido en Python)

class Game:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Post Mortem: Vengeance - Village Edition")
        self.root.geometry("800x600")
        self.root.resizable(False, False)
        
        # Estado del juego
        self.state = "menu"
        self.player_x = 400
        self.player_y = 300
        self.player_health = 100
        self.player_color = "#00BFFF"  # Azure
        self.boss_health = 1000
        self.boss_x = 400
        self.boss_y = 100
        self.boss_phase = 1
        self.boss_speed = 2
        self.boss_active = False
        self.projectiles = []
        self.npc_talked = False
        
        # Canvas para dibujar
        self.canvas = tk.Canvas(self.root, width=800, height=600, bg="#87CEEB")  # Sky blue
        self.canvas.pack()
        
        # Menú
        self.show_menu()
        
        # Controles
        self.keys = {"w": False, "a": False, "s": False, "d": False}
        self.root.bind("<KeyPress>", self.key_press)
        self.root.bind("<KeyRelease>", self.key_release)
        self.root.bind("<space>", self.shoot)
        self.root.bind("<e>", self.interact)
        
        self.game_loop()
        
    def show_menu(self):
        """Muestra el menú principal"""
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, 800, 600, fill="#2C3E50")
        
        self.canvas.create_text(400, 100, text="POST MORTEM: VENGEANCE", 
                               font=("Arial", 32, "bold"), fill="#E74C3C")
        self.canvas.create_text(400, 150, text="Village Edition", 
                               font=("Arial", 16), fill="#3498DB")
        
        # Preview del personaje
        self.canvas.create_rectangle(350, 200, 450, 300, fill=self.player_color, outline="white")
        self.canvas.create_text(400, 320, text="Editor de Personaje", font=("Arial", 14), fill="white")
        
        # Sliders simulados (texto informativo)
        self.canvas.create_text(400, 360, text="(El color del jugador es Azure)", 
                               font=("Arial", 10), fill="#AAA")
        
        # Botón JUGAR
        self.play_btn = self.canvas.create_rectangle(300, 420, 500, 470, fill="#27AE60", outline="white", width=2)
        self.canvas.create_text(400, 445, text="JUGAR", font=("Arial", 20, "bold"), fill="white")
        
        # Instrucciones
        self.canvas.create_text(400, 520, text="WASD: Mover | SPACE: Disparar | E: Interactuar", 
                               font=("Arial", 10), fill="#AAA")
        
        self.canvas.tag_bind(self.play_btn, "<Button-1>", lambda e: self.start_game())
        
    def start_game(self):
        """Inicia el juego"""
        self.state = "playing"
        self.player_health = 100
        self.boss_health = 1000
        self.boss_active = False
        self.boss_phase = 1
        self.projectiles = []
        
    def draw_world(self):
        """Dibuja el mundo del juego"""
        self.canvas.delete("all")
        
        # Cielo
        self.canvas.create_rectangle(0, 0, 800, 600, fill="#87CEEB")
        
        # Pasto
        self.canvas.create_rectangle(0, 400, 800, 600, fill="#32CD32")
        
        # Casas coloridas
        colors = ["#E74C3C", "#3498DB", "#F39C12", "#9B59B6"]
        for i in range(5):
            x = 100 + i * 150
            y = 350
            c = random.choice(colors)
            # Casa
            self.canvas.create_rectangle(x, y, x+80, y+60, fill=c, outline="black")
            # Techo
            self.canvas.create_polygon(x-10, y, x+40, y-30, x+90, y, fill="#8B4513", outline="black")
        
        # Botón de invocación (si no está activo el boss)
        if not self.boss_active:
            btn_color = "#E74C3C"
            self.canvas.create_oval(380, 280, 420, 300, fill=btn_color, outline="black", width=2)
            self.canvas.create_text(400, 270, text="INVOCAR", font=("Arial", 8, "bold"), fill="white")
            self.canvas.create_text(400, 310, text="(Presiona E)", font=("Arial", 8), fill="#666")
        
        # NPC Franco
        self.canvas.create_oval(650, 320, 680, 380, fill="#3498DB", outline="black", width=2)
        self.canvas.create_text(665, 340, text="F", font=("Arial", 12, "bold"), fill="white")
        
        # Mostrar diálogo si está cerca
        if abs(self.player_x - 665) < 50 and abs(self.player_y - 350) < 50:
            self.canvas.create_rectangle(550, 250, 750, 310, fill="white", outline="black", width=2)
            self.canvas.create_text(650, 270, text="¡Hola! Soy Franco.", font=("Arial", 9, "bold"))
            self.canvas.create_text(650, 290, text="¡Escucha la música!", font=("Arial", 8))
        
        # Boss (si está activo)
        if self.boss_active:
            boss_color = "#333333" if self.boss_phase < 3 else "#FF0000"
            # Cuerpo
            self.canvas.create_oval(self.boss_x-30, self.boss_y-30, 
                                   self.boss_x+30, self.boss_y+30, 
                                   fill=boss_color, outline="black", width=3)
            # Cabeza
            self.canvas.create_rectangle(self.boss_x-15, self.boss_y-50, 
                                        self.boss_x+15, self.boss_y-30, 
                                        fill="#1a1a1a", outline="black")
            # Ojos rojos
            self.canvas.create_oval(self.boss_x-10, self.boss_y-45, self.boss_x-5, self.boss_y-40, fill="red")
            self.canvas.create_oval(self.boss_x+5, self.boss_y-45, self.boss_x+10, self.boss_y-40, fill="red")
            
            # Barra de vida del boss
            bar_width = (self.boss_health / 1000) * 200
            self.canvas.create_rectangle(600, 15, 800, 35, fill="#333", outline="white")
            self.canvas.create_rectangle(600, 15, 600+bar_width, 35, fill="#E74C3C")
            self.canvas.create_text(700, 25, text="SUA", font=("Arial", 10, "bold"), fill="white")
        
        # Jugador (Marcos)
        self.canvas.create_rectangle(self.player_x-10, self.player_y-20, 
                                     self.player_x+10, self.player_y+20, 
                                     fill=self.player_color, outline="black", width=2)
        
        # Barra de vida del jugador
        bar_width = (self.player_health / 100) * 200
        self.canvas.create_rectangle(10, 15, 210, 35, fill="#333", outline="white")
        self.canvas.create_rectangle(10, 15, 10+bar_width, 35, fill="#27AE60")
        self.canvas.create_text(110, 25, text="MARCOS", font=("Arial", 10, "bold"), fill="white")
        
        # Proyectiles
        for proj in self.projectiles:
            self.canvas.create_oval(proj["x"]-5, proj["y"]-5, 
                                   proj["x"]+5, proj["y"]+5, 
                                   fill=self.player_color)
    
    def key_press(self, event):
        if event.char in self.keys:
            self.keys[event.char] = True
    
    def key_release(self, event):
        if event.char in self.keys:
            self.keys[event.char] = False
    
    def shoot(self, event):
        """Dispara un proyectil hacia arriba"""
        if self.state == "playing":
            self.projectiles.append({"x": self.player_x, "y": self.player_y, "dy": -10})
    
    def interact(self, event):
        """Interactúa con el botón"""
        if self.state == "playing" and not self.boss_active:
            # Verificar si está cerca del botón
            if abs(self.player_x - 400) < 50 and abs(self.player_y - 290) < 50:
                self.boss_active = True
                messagebox.showinfo("¡ALERTA!", "¡SUA HA DESPERTADO! ¡Prepárate para la batalla!")
    
    def update_player(self):
        """Actualiza posición del jugador"""
        speed = 5
        if self.keys["w"]:
            self.player_y -= speed
        if self.keys["s"]:
            self.player_y += speed
        if self.keys["a"]:
            self.player_x -= speed
        if self.keys["d"]:
            self.player_x += speed
        
        # Límites
        self.player_x = max(20, min(780, self.player_x))
        self.player_y = max(20, min(580, self.player_y))
    
    def update_boss(self):
        """Actualiza IA del boss"""
        if not self.boss_active:
            return
        
        # Fases
        if self.boss_health < 300:
            self.boss_phase = 3
            self.boss_speed = 5
        elif self.boss_health < 700:
            self.boss_phase = 2
            self.boss_speed = 3
        
        # Perseguir al jugador
        dx = self.player_x - self.boss_x
        dy = self.player_y - self.boss_y
        dist = math.sqrt(dx**2 + dy**2)
        
        if dist > 50:
            self.boss_x += (dx / dist) * self.boss_speed
            self.boss_y += (dy / dist) * self.boss_speed
        else:
            # Ataque de contacto
            self.player_health -= 0.5
    
    def update_projectiles(self):
        """Actualiza proyectiles"""
        for proj in self.projectiles[:]:
            proj["y"] += proj["dy"]
            
            # Eliminar si sale de pantalla
            if proj["y"] < 0 or proj["y"] > 600:
                self.projectiles.remove(proj)
                continue
            
            # Colisión con boss
            if self.boss_active:
                dist = math.sqrt((proj["x"] - self.boss_x)**2 + (proj["y"] - self.boss_y)**2)
                if dist < 40:
                    self.boss_health -= 10
                    self.projectiles.remove(proj)
                    if self.boss_health <= 0:
                        self.victory()
    
    def victory(self):
        """Victoria"""
        self.state = "gameover"
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, 800, 600, fill="#27AE60")
        self.canvas.create_text(400, 250, text="¡VICTORIA!", 
                               font=("Arial", 48, "bold"), fill="white")
        self.canvas.create_text(400, 350, text="¡Has derrotado a SUA!", 
                               font=("Arial", 20), fill="white")
        restart_btn = self.canvas.create_rectangle(300, 450, 500, 500, fill="#3498DB", outline="white", width=2)
        self.canvas.create_text(400, 475, text="VOLVER AL MENÚ", font=("Arial", 16), fill="white")
        self.canvas.tag_bind(restart_btn, "<Button-1>", lambda e: self.show_menu())
    
    def defeat(self):
        """Derrota"""
        self.state = "gameover"
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, 800, 600, fill="#E74C3C")
        self.canvas.create_text(400, 250, text="HAS MUERTO", 
                               font=("Arial", 48, "bold"), fill="white")
        restart_btn = self.canvas.create_rectangle(300, 450, 500, 500, fill="#3498DB", outline="white", width=2)
        self.canvas.create_text(400, 475, text="VOLVER AL MENÚ", font=("Arial", 16), fill="white")
        self.canvas.tag_bind(restart_btn, "<Button-1>", lambda e: self.show_menu())
    
    def game_loop(self):
        """Loop principal del juego"""
        if self.state == "playing":
            self.update_player()
            self.update_boss()
            self.update_projectiles()
            self.draw_world()
            
            # Verificar muerte
            if self.player_health <= 0:
                self.defeat()
        
        self.root.after(33, self.game_loop)  # ~30 FPS
    
    def run(self):
        self.root.mainloop()

# Ejecutar el juego
if __name__ == "__main__":
    game = Game()
    game.run()
