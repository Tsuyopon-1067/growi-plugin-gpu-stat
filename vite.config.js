import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                "/__gpustat__": {
                    target: env.VITE_API_TARGET_URL,
                    changeOrigin: true,
                },
            },
        },
    };
});
