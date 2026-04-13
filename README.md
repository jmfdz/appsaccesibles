# appsaccesibles
Aplicaciones accesibles

## Rutas

La app usa `hash history` para que la navegación funcione igual en desarrollo y en producción sin depender de reglas de rewrite en el servidor.

- En desarrollo, Vite sirve la app desde `/`.
- En producción, el build publica bajo `/appsaccesibles/`.
