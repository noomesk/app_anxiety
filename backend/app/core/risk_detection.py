"""
risk_detection.py
─────────────────
Detección de riesgo en dos capas:

  Capa 1 — Keywords de alta precisión:
    Frases que casi exclusivamente aparecen en contextos de ideación suicida
    o autolesión. Se evalúan primero.

  Capa 2 — Filtro de falsos positivos:
    Expresiones coloquiales del español latinoamericano que contienen
    palabras sensibles pero NO indican crisis. Se evalúan antes de
    decidir que hay riesgo.

La función detect_risk() devuelve True SOLO si:
  - Hay al menos una keyword de alta precisión en el texto, Y
  - El texto no coincide con ningún patrón de falso positivo conocido.
"""

from typing import List


# ─────────────────────────────────────────────────────────────
# CAPA 1: Keywords de alta precisión
# Solo frases que casi siempre indican ideación suicida real
# ─────────────────────────────────────────────────────────────

HIGH_PRECISION_KEYWORDS: List[str] = [
    # Ideación suicida explícita
    "quiero suicidarme",
    "voy a suicidarme",
    "pienso en suicidarme",
    "estoy pensando en suicidarme",
    "quiero quitarme la vida",
    "voy a quitarme la vida",
    "pienso quitarme la vida",
    "quiero acabar con mi vida",
    "voy a acabar con mi vida",
    "quiero morir",
    "quiero estar muerto",
    "quiero estar muerta",
    "deseo morir",
    "prefiero morir",
    "mejor estaría muerto",
    "mejor estaría muerta",
    "no quiero seguir viviendo",
    "no quiero seguir vivo",
    "no quiero seguir viva",
    "no quiero vivir más",
    "no quiero vivir mas",

    # Autolesión explícita
    "quiero hacerme daño",
    "voy a hacerme daño",
    "me estoy haciendo daño",
    "quiero cortarme",
    "me quiero cortar",
    "quiero lastimarme",
    "me quiero lastimar",

    # Frases de despedida con connotación de fin
    "ya no estaré aquí",
    "ya no voy a estar",
    "me voy a ir para siempre",
    "es mi última vez",
    "es la última vez que hablo",
    "nadie me va a extrañar",
    "ya encontré la forma de hacerlo",
    "ya sé cómo hacerlo",
    "tengo pastillas para",
    "tengo algo para hacerlo",
]


# ─────────────────────────────────────────────────────────────
# CAPA 2: Filtro de falsos positivos
# Expresiones coloquiales que contienen palabras sensibles
# pero NO indican crisis
# ─────────────────────────────────────────────────────────────

FALSE_POSITIVE_PHRASES: List[str] = [
    # "no tiene sentido" — queja cotidiana
    "no tiene sentido ir",
    "no tiene sentido hacer",
    "no tiene sentido que",
    "no tiene sentido esto",
    "no tiene sentido esperar",
    "no tiene sentido estudiar",
    "no tiene sentido trabajar",
    "no tiene sentido hablar",
    "no tiene sentido comprar",
    "no tiene sentido pagar",
    "esto no tiene sentido",
    "eso no tiene sentido",

    # "me muero" / "me mato" — expresiones de intensidad emocional
    "me muero de risa",
    "me muero de vergüenza",
    "me muero de hambre",
    "me muero de sueño",
    "me muero de calor",
    "me muero de frío",
    "me muero de aburrimiento",
    "me muero de los nervios",   # ansiedad, no crisis
    "me mato de risa",
    "me mato trabajando",
    "me mato estudiando",
    "mato el tiempo",
    "matando el tiempo",
    "me mata de risa",
    "me mata el calor",
    "me mata el estrés",         # estrés, no crisis

    # "quiero morir" en contexto claramente hiperbólico
    "quiero morir de la vergüenza",
    "quiero morir de risa",
    "quiero morirme de la pena",
    "quiero morirme de vergüenza",

    # "desesperanza" y "tristeza" como emociones cotidianas
    "un poco de desesperanza",
    "algo de desesperanza",
    "siento desesperanza por",
    "siento tristeza",
    "estoy triste",
    "mucha tristeza",
    "extrema tristeza por",      # tristeza ante una situación, no crisis

    # "crisis" en contextos no suicidas
    "crisis económica",
    "crisis laboral",
    "crisis en el trabajo",
    "crisis en la universidad",
    "crisis de ansiedad",        # ansiedad manejable, no ideación suicida
    "crisis de estrés",
    "crisis de pareja",
    "crisis existencial",        # filosófico, no suicida por defecto
    "crisis académica",
    "estoy en crisis con",
    "en una crisis de",

    # Expresiones de agotamiento (NO ideación)
    "ya no aguanto el estrés",
    "ya no aguanto la presión",
    "ya no aguanto a",
    "no aguanto más este trabajo",
    "no aguanto más la universidad",
    "no aguanto más esta situación",
]


# ─────────────────────────────────────────────────────────────
# Función principal
# ─────────────────────────────────────────────────────────────

def detect_risk(text: str) -> bool:
    """
    Detecta si el mensaje del usuario indica una situación de crisis real.

    Proceso:
    1. Normaliza el texto.
    2. Filtra falsos positivos conocidos → si hay coincidencia, no hay crisis.
    3. Busca keywords de alta precisión → si hay coincidencia, hay crisis.

    Returns:
        True  → crisis real detectada
        False → sin crisis (incluye casos de falsos positivos filtrados)
    """
    text_lower = text.lower().strip()

    # Paso 1: filtrar falsos positivos PRIMERO
    for phrase in FALSE_POSITIVE_PHRASES:
        if phrase in text_lower:
            return False

    # Paso 2: buscar keywords de alta precisión
    for keyword in HIGH_PRECISION_KEYWORDS:
        if keyword in text_lower:
            return True

    return False


def get_crisis_response() -> str:
    """
    Respuesta empática para situaciones de crisis real.
    No se usa para ansiedad cotidiana.
    """
    return (
        "Oye, me alegra que estés hablando conmigo. "
        "Lo que describes suena muy pesado, y quiero que sepas que no estás solo/a en esto. "
        "¿Estarías dispuesto/a a llamar a alguien que pueda acompañarte ahora mismo? "
        "En Colombia puedes marcar la Línea 106 — es gratuita, confidencial, "
        "y hay personas reales al otro lado. "
        "También está la Línea 192 opción 4 si necesitas apoyo en salud mental. "
        "No tienes que pasar por esto solo/a."
    )
