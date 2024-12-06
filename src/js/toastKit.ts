import "../css/style.css";

export enum ToastStyle {
    light = 'light',
    solid = 'solid',
    gradient = 'gradient'
}

export enum ToastType {
    success = 'success',
    warning = 'warning',
    error = 'error',
    info = 'info'
}

type ToastConfig = {
    title: string;
    message: string;
    position?: string;
    duration?: number;
    style?: ToastStyle;
    border?: boolean;
    type?: ToastType;
    onOpen?: () => void;
    onClose?: () => void;
}

class ToastManager {

    static instance: ToastManager;

    private container: HTMLElement | null = null;
    private iconMap: Record<string, string> = {
        success: `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `,
        warning: `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        `,
        error: `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        `,
        info: `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            title: 'Toast Title',
            message: 'Write your message here o add other content text',
            position: 'top-right',
            duration: 3000,
            style: ToastStyle.solid,
            border: true,
            type: ToastType.info
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
    show(options: ToastConfig) {
        // Combinar configuraciones por defecto con las pasadas
        const config = {
            ...this.defaultConfig,
            ...options
        };

        // Actualizar posición del contenedor si es necesario
        this.setPosition(config.position!);

        const toast = document.createElement('div');
        toast.classList.add('toast-kit');

        // Establecer estilos según config.style
        if (config.style === ToastStyle.light) {
            toast.classList.add(`toast-kit-${config.type}-light`);
        } else if (config.style === ToastStyle.gradient) {
            toast.classList.add(`toast-kit-${config.type}-gradient`);
        } else {
            toast.classList.add(`toast-kit-${config.type}-solid`);
        }

        if (config.border) toast.classList.add('toast-kit-border');

        // Crear icono
        const icon = document.createElement('div');
        icon.classList.add('toast-kit-icon');
        if (config.style === ToastStyle.light) {
            if (config.type === ToastType.success) {
                icon.classList.add('toast-kit-icon-success-light');
            } else if (config.type === ToastType.warning) {
                icon.classList.add('toast-kit-icon-warning-light');
            } else if (config.type === ToastType.error) {
                icon.classList.add('toast-kit-icon-error-light');
            } else {
                icon.classList.add('toast-kit-icon-info-light');
            }
        } else {
            if (config.type === ToastType.success) {
                icon.classList.add('toast-kit-icon-success-gradient');
            } else if (config.type === ToastType.warning) {
                icon.classList.add('toast-kit-icon-warning-gradient');
            } else if (config.type === ToastType.error) {
                icon.classList.add('toast-kit-icon-warning-gradient');
            } else {
                icon.classList.add('toast-kit-icon-info-gradient');
            }
        }
        icon.innerHTML = this.iconMap[config.type!];
        toast.appendChild(icon);

        // Crear contenido
        const content = document.createElement('div');
        content.classList.add('toast-kit-content');

        const title = document.createElement('h3');
        title.textContent = config.title;
        if (config.style === ToastStyle.light) {
            title.classList.add('h3-light');
        } else if (config.style === ToastStyle.gradient) {
            title.classList.add('h3-gradient');
        }

        const body = document.createElement('p');
        body.textContent = config.message;
        if (config.style === ToastStyle.light) {
            body.classList.add('p-light');
        } else if (config.style === ToastStyle.gradient) {
            body.classList.add('p-gradient');
        }

        content.appendChild(title);
        content.appendChild(body);
        toast.appendChild(content);

        // Botón de cierre
        const close = document.createElement('span');
        close.textContent = '✕';
        close.classList.add('toast-kit-close');
        if (config.style === ToastStyle.light) {
            close.classList.add('toast-kit-close-light');
        } else {
            close.classList.add('toast-kit-close-gradient');
        }
        toast.appendChild(close);

        // Añadir al contenedor
        this.container!.appendChild(toast);
        config.onOpen?.();

        // Trigger reflow to enable transition
        toast.offsetHeight;

        // Manejo del temporizador
        let timer: number | null = null;
        if (config.duration && config.duration > 0) {
            timer = window.setTimeout(() => this.remove(toast, config.onClose), config.duration);
        }

        // Cerrar manualmente y cancelar temporizador
        close.onclick = () => {
            // Cancelar el temporizador si existe
            if (timer !== null) {
                clearTimeout(timer);
            }

            this.remove(toast, config.onClose);
        };

        return this; // Permitir encadenamiento
    }

    // Método de previsualización para desarrollo
    preview(options: ToastConfig = {
        title: 'Toast Title',
        message: 'Write your message here o add other content text',
        duration: 0,
        position: 'top-right',
        style: ToastStyle.light,
        border: true,
        type: ToastType.info
    }) {
        // Mostrar todos los tipos de toast
        this.success({
            ...options,
            title: 'Success',
            message: 'Operación completada con éxito.',
        })
            .warning({
                ...options,
                title: 'Warning',
                message: 'Advertencia: Revisa tus datos',
            })
            .error({
                ...options,
                title: 'Error',
                message: 'Error crítico en la aplicación',
            })
            .info({
                ...options,
                title: 'Info',
                message: 'Información importante',
            });

        return this;
    }

    // Métodos de conveniencia
    success(options: ToastConfig) {
        return this.show({ ...options, type: ToastType.success });
    }

    warning(options: ToastConfig) {
        return this.show({ ...options, type: ToastType.warning });
    }

    error(options: ToastConfig) {
        return this.show({ ...options, type: ToastType.error });
    }

    info(options: ToastConfig) {
        return this.show({ ...options, type: ToastType.info });
    }

    // Método para cambiar la posición
    setPosition(position: string) {
        this.container!.className = position;
        return this;
    }

    // Método para eliminar toast
    remove(toast: HTMLElement, onClose?: () => void) {
        toast.classList.add('toast-kit-hidden');
        toast.addEventListener('animationend', () => {
            this.container!.removeChild(toast);
            onClose?.();
        });

        return this;
    }
}

export default ToastManager;