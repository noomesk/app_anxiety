"""
email_service.py
────────────────
Servicio de envío de emails usando Resend.
Ubicación: backend/app/services/email_service.py

Usa el dominio gratuito de Resend: onboarding@resend.dev
LIMITACIÓN: Con el dominio gratuito solo puedes enviar emails
a direcciones que hayas verificado manualmente en Resend.
Para enviar a cualquier email necesitas un dominio propio.

Instrucciones para verificar un email en Resend (plan gratuito):
  1. Entra a resend.com → Audiences o Settings
  2. Agrega el email del destinatario como "verified address"
  3. Ese email recibirá un enlace de confirmación

Para producción real: verifica un dominio propio en Resend.
"""

import resend
from app.core.config import settings


def _get_client() -> None:
    """Configura la API key de Resend."""
    resend.api_key = settings.RESEND_API_KEY


async def send_password_reset_email(to_email: str, reset_url: str) -> bool:
    """
    Envía el email de recuperación de contraseña.

    Args:
        to_email:  Email del destinatario.
        reset_url: URL completa con el token de reset.

    Returns:
        True si el envío fue exitoso, False si falló.
    """
    _get_client()

    html_body = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f1ec;font-family:Georgia,serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ec;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="520" cellpadding="0" cellspacing="0"
                   style="background-color:#ffffff;border-radius:20px;overflow:hidden;
                          box-shadow:0 4px 24px rgba(52,50,43,0.08);">

              <!-- Header verde -->
              <tr>
                <td style="background-color:#4A654F;padding:36px 40px;text-align:center;">
                  <p style="margin:0;font-size:32px;">🌿</p>
                  <h1 style="margin:12px 0 0;color:#ffffff;font-size:22px;
                             font-weight:bold;letter-spacing:-0.3px;">
                    Brotito
                  </h1>
                  <p style="margin:6px 0 0;color:#b8d4bc;font-size:13px;">
                    Tu santuario de calma
                  </p>
                </td>
              </tr>

              <!-- Cuerpo -->
              <tr>
                <td style="padding:40px 40px 32px;">
                  <h2 style="margin:0 0 16px;color:#2d2d2d;font-size:20px;font-weight:bold;">
                    Recupera tu contraseña
                  </h2>
                  <p style="margin:0 0 24px;color:#5a5a5a;font-size:15px;line-height:1.7;">
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta.
                    Haz clic en el botón de abajo — el enlace es válido por
                    <strong>30 minutos</strong>.
                  </p>

                  <!-- Botón -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                    <tr>
                      <td style="background-color:#4A654F;border-radius:50px;
                                 box-shadow:0 6px 20px rgba(74,101,79,0.25);">
                        <a href="{reset_url}"
                           style="display:inline-block;padding:16px 36px;
                                  color:#ffffff;font-size:15px;font-weight:bold;
                                  text-decoration:none;letter-spacing:0.2px;">
                          Restablecer contraseña
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 8px;color:#8a8a8a;font-size:13px;line-height:1.6;">
                    Si no solicitaste este cambio, ignora este correo.
                    Tu contraseña actual permanecerá igual.
                  </p>
                  <p style="margin:0;color:#8a8a8a;font-size:13px;line-height:1.6;">
                    ¿Problemas con el botón? Copia este enlace en tu navegador:
                  </p>
                  <p style="margin:8px 0 0;word-break:break-all;">
                    <a href="{reset_url}"
                       style="color:#4A654F;font-size:12px;text-decoration:underline;">
                      {reset_url}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f9f7f4;padding:20px 40px;
                           text-align:center;border-top:1px solid #ede9e3;">
                  <p style="margin:0;color:#aaaaaa;font-size:12px;">
                    © 2025 Brotito · Tu santuario de calma
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    try:
        params = {
            "from": "Brotito <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Recupera tu contraseña — Brotito 🌿",
            "html": html_body,
        }
        resend.Emails.send(params)
        print(f"[email_service] Email enviado a: {to_email}")
        return True

    except Exception as e:
        print(f"[email_service] Error enviando email a {to_email}: {e}")
        return False
