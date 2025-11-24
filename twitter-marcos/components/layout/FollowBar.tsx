const FollowBar = () => {
    return (
        <div className="px-6 py-4 hidden lg:block ">
            <div className="bg-neutral-800 rounded-xl p-4">
                <h2 className="text-white text-xl font-semibold ">A quien seguir</h2>
                <div className="flex flex-col gap-6 mt-4"
                >
                    {/* Aquí irían los componentes de usuario sugerido */}

                </div>
            </div>

        </div>

    );
}

export default FollowBar;