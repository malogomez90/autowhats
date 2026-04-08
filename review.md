**Informe de Revisión de Código**

### **1. Detección de Problemas**

#### **Bugs**
- **Token no almacenado en Frontend**: Tras el login, el token JWT recibido no se guarda en `localStorage`/`sessionStorage`, haciendo imposible acceder a rutas protegidas (SessionPage).
- **Inconsistencia en datos de sesión**: `sessionData.messages` (de la BD) y `messages` (generados aparte) muestran información diferente, creando confusión.
- **Falta de paginación/limite en consultas SQL**: Las queries a `sessions` no tienen límites, riesgo de sobrecarga con muchos registros.

#### **Vulnerabilidades**
- **XSS potencial**: Almacenar el token en `localStorage` sin medidas de protección (HttpOnly, Secure flags).
- **Validación de teléfono ausente**: Acepta cualquier formato de número sin verificación.
- **Middleware de autenticación incompleto**: No verifica si el usuario existe en la BD tras validar el JWT.

#### **Malas Prácticas**
- **Redundancia en llamadas API**: SessionPage hace 2 llamadas separadas (`/session/:id` y `/session/:id/messages`) en lugar de una unificada.
- **Manejo de errores genérico**: Los catch en controladores devuelven mensajes genéricos (`500: Something went wrong`), dificultando debugging.
- **Datos de sesión duplicados**: La tabla `sessions` almacena `session_data` (JSON) y hay una tabla separada para mensajes, generando redundancia.

---

### **2. Mejoras Sugeridas**

#### **Críticas**
1. **Frontend: Almacenar token tras login**:
   ```javascript
   // En LoginPage.jsx, después de recibir la respuesta:
   localStorage.setItem('token', response.data.token);
   ```
2. **Validar formato de teléfono**:
   ```javascript
   // En authController.js, antes de la query:
   const isValid = /^\+[1-9]\d{1,14}$/.test(phoneNumber);
   if (!isValid) return res.status(400).json({ error: 'Invalid phone number' });
   ```
3. **Reforzar authMiddleware**:
   ```javascript
   // Añadir verificación de usuario en BD:
   const user = await db.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
   if (!user.rows[0]) return res.status(401).json({ error: 'User not found' });
   ```

#### **Recomendadas**
- **Unificar endpoints de sesión**: Combinar `GET /api/session/:id` y `GET /api/session/:id/messages` en una sola respuesta.
- **Implementar limpieza de sesiones**: Añadir cron job para borrar sesiones antiguas:
  ```sql
  DELETE FROM sessions WHERE created_at < NOW() - INTERVAL '24 hours';
  ```
- **Usar cookies HttpOnly para JWT**:
  ```javascript
  // Backend al enviar token:
  res.cookie('token', token, { httpOnly: true, secure: true });
  ```

#### **Opcionales**
- **Actualizar dependencias**: `react-scripts@5.0.1` → `5.0.2`, `express@4.18.2` → `4.19.2`.
- **Añadir TypeScript**: Mejorar tipado y detectar errores temprano.
- **Mejorar mensajes de error**:
  ```javascript
  // Ejemplo en authController.js:
  res.status(500).json({ error: 'Database error: Failed to create user' });
  ```

---

### **3. Puntuación de Calidad**
**6/10**  
**Fundamentos**:  
- ✅ Estructura MVC clara y organización modular.  
- ✅ Uso de JWT para autenticación.  
- ❌ Falta de validaciones clave y manejo inseguro de tokens.  
- ❌ Redundancia en datos y API que impactan mantenimiento.  

**Acciones Recomendadas**: Implementar las mejoras críticas para elevar la puntuación a 8/10.