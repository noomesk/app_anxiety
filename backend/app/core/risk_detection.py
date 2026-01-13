from app.core.config import settings

def detect_risk(text: str) -> bool:
    """
    Detects if the user's message contains risk keywords indicating a crisis situation.
    Returns True if risk is detected, False otherwise.
    """
    text_lower = text.lower()
    for keyword in settings.RISK_KEYWORDS:
        if keyword in text_lower:
            return True
    return False

def get_crisis_response() -> str:
    """
    Returns a predefined safe response for crisis situations.
    """
    return (
        "Lo que estás sintiendo ahora es muy difícil, y quiero que sepas que no estás solo. "
        "En momentos como este, es importante buscar apoyo inmediato. "
        "Por favor, contacta a tu terapeuta o llama a una línea de ayuda emocional. "
        "Tu vida es valiosa y hay personas que quieren ayudarte."
    )