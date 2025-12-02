# Shape Shooter Showdown - React Native con Expo

Un juego de disparos clásico construido con React Native y Expo.

## Características

- Juego de disparos con Canvas HTML5 adaptado para React Native
- Controles táctiles para dispositivos móviles
- Sistema de vidas y puntuación
- Enemigos y jefe final
- Funciona en iOS, Android y Web

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Expo CLI (se instalará automáticamente)
- Para iOS: macOS con Xcode
- Para Android: Android Studio

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/CarolinaFdezSantaella/JuegoDisparos.git
cd JuegoDisparos
```

2. Instala las dependencias:
```bash
npm install
```

## Ejecución

### Desarrollo

Para iniciar el servidor de desarrollo de Expo:

```bash
npm start
```

Esto abrirá Expo Developer Tools en tu navegador. Desde ahí puedes:

- Presionar `a` para abrir en un emulador Android
- Presionar `i` para abrir en un simulador iOS
- Escanear el código QR con la app Expo Go en tu dispositivo móvil
- Presionar `w` para abrir en el navegador web

### Plataformas específicas

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Web
```bash
npm run web
```

## Cómo Jugar

- **Móvil**: Toca la pantalla para mover el jugador. El disparo es automático.
- **Web**: Usa las teclas de flecha o A/D para moverte, Espacio para disparar.

## Estructura del Proyecto

```
/
├── app/                    # Rutas de Expo Router
│   ├── _layout.tsx        # Layout principal
│   └── index.tsx          # Pantalla principal
├── components/            # Componentes React Native
│   └── game/             
│       ├── GameCanvas.tsx # Componente principal del juego
│       └── ui/           # Componentes de interfaz
├── lib/                   # Lógica del juego
│   └── game-engine/      # Motor del juego
├── assets/               # Recursos (iconos, imágenes)
├── app.json              # Configuración de Expo
└── package.json          # Dependencias

```

## Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil
- **Expo** - Plataforma para React Native
- **TypeScript** - Tipado estático
- **react-native-canvas** - Renderizado Canvas en React Native

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

