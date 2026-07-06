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


def test_real_openai_key_can_enable_live_when_configured_provider_is_placeholder(monkeypatch):
    monkeypatch.setattr(providers, "GROQ_API_KEY", "your_groq_api_key_here")
    monkeypatch.setattr(providers, "OPENAI_API_KEY", "sk-live-test-123456789")
    monkeypatch.setattr(providers, "LLM_PROVIDER", "groq")
    monkeypatch.setattr(providers, "OLLAMA_BASE_URL", "")

    assert providers.get_available_providers() == ["openai"]
    assert providers.get_active_provider() == "openai"
    assert providers.is_live_available() is True


def test_ollama_is_not_active_unless_selected(monkeypatch):
    monkeypatch.setattr(providers, "GROQ_API_KEY", "")
    monkeypatch.setattr(providers, "OPENAI_API_KEY", "")
    monkeypatch.setattr(providers, "ANTHROPIC_API_KEY", "")
    monkeypatch.setattr(providers, "GEMINI_API_KEY", "")
    monkeypatch.setattr(providers, "OPENROUTER_API_KEY", "")
    monkeypatch.setattr(providers, "OLLAMA_BASE_URL", "http://localhost:11434")
    monkeypatch.setattr(providers, "LLM_PROVIDER", "groq")

    assert providers.get_available_providers() == ["ollama"]
    assert providers.get_active_provider() is None
    assert providers.is_live_available() is False
