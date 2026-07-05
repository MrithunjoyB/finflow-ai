import utils.llm_providers as providers


def test_placeholder_groq_key_does_not_enable_live(monkeypatch):
    monkeypatch.setattr(providers, "GROQ_API_KEY", "your_groq_api_key_here")
    monkeypatch.setattr(providers, "LLM_PROVIDER", "groq")
    monkeypatch.setattr(providers, "OLLAMA_BASE_URL", "")

    assert providers.is_valid_secret("your_groq_api_key_here") is False
    assert providers.get_available_providers() == []
    assert providers.is_live_available() is False
    assert providers.get_active_provider() is None


def test_empty_groq_key_does_not_enable_live(monkeypatch):
    monkeypatch.setattr(providers, "GROQ_API_KEY", "   ")
    monkeypatch.setattr(providers, "LLM_PROVIDER", "groq")
    monkeypatch.setattr(providers, "OLLAMA_BASE_URL", "")

    assert providers.get_available_providers() == []
    assert providers.is_live_available() is False


def test_real_looking_groq_key_enables_provider(monkeypatch):
    monkeypatch.setattr(providers, "GROQ_API_KEY", "gsk_live_test_123456789")
    monkeypatch.setattr(providers, "LLM_PROVIDER", "groq")
    monkeypatch.setattr(providers, "OLLAMA_BASE_URL", "")

    assert providers.is_valid_secret("gsk_live_test_123456789") is True
    assert providers.get_available_providers() == ["groq"]
    assert providers.get_active_provider() == "groq"
    assert providers.is_live_available() is True
