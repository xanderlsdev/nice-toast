import "../css/style.css";

interface ToastConfig {
    position: string;
    duration: number;
    type: string;
}

class ToastManager {

    static instance: ToastManager;

    private container: HTMLElement | null = null;
    private iconMap: Record<string, string> = {
        success: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `,
        warning: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        `,
        error: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        `,
        info: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `
    };
    private defaultConfig: ToastConfig | null = null;

    constructor() {
        // Singleton pattern
        if (ToastManager.instance) {
            return ToastManager.instance;
        }

        // Crear contenedor dinámicamente
        this.container = document.createElement('div');
        this.container.id = 'toast-kit-container';
        this.container.className = 'top-right';
    
        // Configuración por defecto
        this.defaultConfig = {
            position: 'top-right',
            duration: 3000,
            type: 'info'
        };

        // Agregar al body automáticamente
        document.body.appendChild(this.container);

        // Almacenar la instancia
        ToastManager.instance = this;
    }

    // Método estático para obtener la instancia singleton
    static getInstance() {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager();
        }
        return ToastManager.instance;
    }

    // Método principal de toast con opciones flexibles
    show(message: string, options: ToastConfig) {
        // Combinar configuraciones por defecto con las pasadas
        const config = {
            ...this.defaultConfig,
            ...options
        };

        // Actualizar posición del contenedor si es necesario
        this.setPosition(config.position!);

        const toast = document.createElement('div');
        toast.classList.add('toast-kit', `toast-${config.type}`);
        // toast.style.transform = 'translateY(-20px)';
        
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('toast-kit-icon');
        iconContainer.innerHTML = this.iconMap[config.type!];
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('toast-kit-content');
        contentDiv.textContent = message;
        
        const closeSpan = document.createElement('span');
        closeSpan.textContent = '✕';
        closeSpan.classList.add('toast-kit-close');
        closeSpan.onclick = () => this.remove(toast);
        
        toast.appendChild(iconContainer);
        toast.appendChild(contentDiv);
        toast.appendChild(closeSpan);
        
        this.container!.appendChild(toast);
        
        // Trigger reflow to enable transition
        toast.offsetHeight;
        toast.classList.add('show');
        
        if (config.duration! > 0) {
            setTimeout(() => this.remove(toast), config.duration);
        }

        return this; // Permitir encadenamiento
    }

    // Métodos de conveniencia
    success(message: string, options: ToastConfig) {
        return this.show(message, { ...options, type: 'success' });
    }

    warning(message: string, options: ToastConfig) {
        return this.show(message, { ...options, type: 'warning' });
    }

    error(message: string, options: ToastConfig) {
        return this.show(message, { ...options, type: 'error' });
    }

    info(message: string, options: ToastConfig) {
        return this.show(message, { ...options, type: 'info' });
    }

    // Método para cambiar la posición
    setPosition(position: string) {
        this.container!.className = position;
        return this;
    }

    // Método para eliminar toast
    remove(toast: HTMLElement) {
        toast.classList.remove('show');
        setTimeout(() => {
            this.container!.removeChild(toast);
        }, 300);
        return this;
    }
}

export default ToastManager;
