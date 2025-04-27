/***************************************************************************************************
 * Load `$localize` - used if you use Angular's internationalization (i18n).
 */
import '@angular/localize/init';

// Add global object for libraries expecting Node.js environment
(window as any).global = window;
