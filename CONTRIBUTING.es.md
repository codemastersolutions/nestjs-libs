# Contribuyendo a NestJS Libs

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](CONTRIBUTING.md)
- [🇧🇷 Português](CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](CONTRIBUTING.es.md)

---

¡Damos la bienvenida a las contribuciones al monorepo `nestjs-libs`! Este documento proporciona pautas e información para los contribuyentes trabajando en cualquiera de nuestras bibliotecas NestJS.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Primeros Pasos](#primeros-pasos)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Flujo de Desarrollo](#flujo-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Pruebas](#pruebas)
- [Documentación](#documentación)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reporte de Issues](#reporte-de-issues)
- [Proceso de Release](#proceso-de-release)

## Código de Conducta

Al participar en este proyecto, aceptas cumplir con nuestro Código de Conducta. Por favor, sé respetuoso y constructivo en todas las interacciones.

## Primeros Pasos

### Prerrequisitos

- Node.js 18+ y pnpm
- Git
- Conocimiento básico de NestJS y TypeScript
- Comprensión de la biblioteca específica a la que deseas contribuir

### Fork y Clone

1. Haz un fork del repositorio en GitHub
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/nestjs-libs.git
   cd nestjs-libs
   ```

## Configuración del Entorno

1. Instala las dependencias:

   ```bash
   pnpm install
   ```

2. Navega a la biblioteca específica en la que deseas trabajar:

   ```bash
   cd libs/<nombre-de-biblioteca>
   ```

3. Ejecuta las pruebas para asegurar que todo funciona:

   ```bash
   pnpm test
   ```

4. Construye la biblioteca:
   ```bash
   pnpm run build
   ```

## Estructura del Proyecto

```
nestjs-libs/
├── .github/                        # Workflows y plantillas de GitHub
├── libs/                           # Todas las bibliotecas NestJS
│   └── <nombre-de-biblioteca>/
│       ├── src/
│       │   ├── *.constants.ts      # Constantes y tokens
│       │   ├── *.module.ts         # Definición del módulo NestJS
│       │   ├── *.service.ts        # Implementaciones de servicios
│       │   ├── *.types.ts          # Interfaces TypeScript
│       │   └── index.ts            # Exportaciones de la API pública
│       ├── *.spec.ts               # Pruebas unitarias
│       ├── jest.config.cjs         # Configuración de Jest
│       ├── package.json            # Configuración del paquete
│       ├── tsconfig.*.json         # Configuraciones de TypeScript
│       └── README*.md              # Documentación de la biblioteca
├── scripts/                        # Scripts de build y gestión
├── src/                           # Aplicaciones de ejemplo
├── package.json                    # Configuración del paquete raíz
└── pnpm-workspace.yaml            # Configuración del workspace
```

## Flujo de Desarrollo

### Nomenclatura de Ramas

Usa nombres descriptivos para las ramas:

- `feature/<nombre-de-biblioteca>/add-oauth-support`
- `fix/<nombre-de-biblioteca>/middleware-cors-issue`
- `docs/<nombre-de-biblioteca>/update-readme`
- `refactor/<nombre-de-biblioteca>/service-cleanup`

### Mensajes de Commit

Sigue el formato de commits convencionales:

```
type(scope): description

[optional body]

[optional footer]
```

Ejemplos:

- `feat(better-auth): add session validation method`
- `fix(better-auth): resolve CORS configuration issue`
- `docs(better-auth): update installation instructions`
- `test(better-auth): add unit tests for auth methods`

### Tipos:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de error
- `docs`: Cambios en la documentación
- `style`: Cambios de estilo de código (formato, etc.)
- `refactor`: Refactorización de código
- `test`: Agregar o actualizar pruebas
- `chore`: Tareas de mantenimiento

## Estándares de Código

### TypeScript

- Usa configuración estricta de TypeScript
- Prefiere interfaces en lugar de types para formas de objetos
- Usa modificadores de acceso apropiados (`private`, `protected`, `public`)
- Documenta APIs públicas con comentarios JSDoc

### Estilo de Código

- Sigue el estilo de código existente (configuración de Prettier)
- Usa nombres significativos para variables y funciones
- Mantén las funciones pequeñas y enfocadas
- Prefiere composición sobre herencia

### Ejemplo de Estilo de Código:

```typescript
/**
 * Maneja solicitudes de servicio para integración con biblioteca
 * @param request - La solicitud entrante
 * @returns Promise que resuelve a la respuesta del servicio
 */
async handleRequest(request: ServiceRequest): Promise<ServiceResponse> {
  // Validar entrada
  if (!this.isValidRequest(request)) {
    throw new BadRequestException('Solicitud de servicio inválida');
  }

  // Procesar solicitud
  return this.processRequest(request);
}
```

## Pruebas

### Pruebas Unitarias

- Escribe pruebas unitarias para toda nueva funcionalidad
- Mantén al menos 80% de cobertura de código
- Usa nombres descriptivos para las pruebas
- Sigue el patrón AAA (Arrange, Act, Assert)

### Estructura de Prueba:

```typescript
describe('LibraryService', () => {
  describe('handleRequest', () => {
    it('debe procesar exitosamente una solicitud de servicio válida', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      const expectedResponse = createExpectedResponse();

      // Act
      const result = await service.handleRequest(mockRequest);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
```

### Ejecutando Pruebas

```bash
# Ejecutar todas las pruebas
pnpm test

# Ejecutar pruebas en modo watch
pnpm test:watch

# Ejecutar pruebas con cobertura
pnpm test:cov

# Ejecutar archivo de prueba específico
pnpm test <nombre-de-biblioteca>.service.spec.ts
```

## Documentación

### Documentación de Código

- Documenta todas las APIs públicas con JSDoc
- Incluye descripciones de parámetros y tipos de retorno
- Agrega ejemplos de uso para funcionalidades complejas

### Actualizaciones del README

- Actualiza todas las versiones de idioma (EN, PT-BR, ES)
- Incluye nuevas funcionalidades en los ejemplos
- Actualiza opciones de configuración
- Agrega información de solución de problemas si es necesario

## Proceso de Pull Request

### Antes de Enviar

1. **Prueba tus cambios:**

   ```bash
   pnpm test
   pnpm run build
   ```

2. **Verifica el estilo del código:**

   ```bash
   pnpm run lint
   pnpm run format
   ```

3. **Actualiza la documentación** si es necesario

4. **Agrega pruebas** para nueva funcionalidad

### Pautas del PR

1. **Título:** Usa títulos claros y descriptivos
2. **Descripción:** Explica qué cambios se hicieron y por qué
3. **Pruebas:** Describe cómo se probaron los cambios
4. **Breaking Changes:** Marca claramente cualquier cambio que rompa compatibilidad
5. **Documentación:** Nota cualquier actualización de documentación

### Plantilla del PR

```markdown
## Descripción

Breve descripción de los cambios

## Tipo de Cambio

- [ ] Corrección de error
- [ ] Nueva funcionalidad
- [ ] Cambio que rompe compatibilidad
- [ ] Actualización de documentación

## Pruebas

- [ ] Las pruebas unitarias pasan
- [ ] Las pruebas de integración pasan
- [ ] Pruebas manuales completadas

## Checklist

- [ ] El código sigue las pautas de estilo del proyecto
- [ ] Auto-revisión completada
- [ ] Documentación actualizada
- [ ] Pruebas agregadas/actualizadas
```

## Reporte de Issues

### Reportes de Error

Incluye:

- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs comportamiento actual
- Detalles del entorno (versión de Node.js, versión de NestJS, etc.)
- Ejemplos de código si aplica

### Solicitudes de Funcionalidad

Incluye:

- Descripción clara de la funcionalidad propuesta
- Caso de uso y motivación
- Posible enfoque de implementación
- Ejemplos de cómo se usaría

## Proceso de Release

La biblioteca usa releases automatizados:

1. **Desarrollo:** Trabaja en ramas de funcionalidad
2. **Pull Request:** Envía PR a la rama `main`
3. **Revisión:** Revisión de código y aprobación
4. **Merge:** El merge del PR dispara build y release automatizados
5. **Versionado:** Versionado semántico basado en mensajes de commit

### Incremento de Versión

- `feat:` → Incremento de versión menor
- `fix:` → Incremento de parche
- `BREAKING CHANGE:` → Incremento de versión mayor

## Obteniendo Ayuda

- **Documentación:** Revisa los archivos README
- **Issues:** Busca issues existentes en GitHub
- **Discusiones:** Usa GitHub Discussions para preguntas
- **Documentación de la Biblioteca:** Consulta el README y documentación de la biblioteca específica

## Reconocimiento

Los contribuyentes son reconocidos en:

- Lista de contribuyentes de GitHub
- Notas de release para contribuciones significativas
- Campo contributors del package.json

## Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la Licencia MIT.

---

¡Gracias por contribuir a `nestjs-libs`! 🚀
