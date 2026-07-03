# Security Notes

## Environment Variables

FinFlow uses `.env` for local configuration. Copy `.env.example` to `.env` and set values locally.

Do not commit `.env`.

## API Key Handling

`GROQ_API_KEY` is read from environment variables. It is not hard-coded in the repository.

For public demos, use:

```text
DEMO_MODE=true
```

This avoids requiring or exposing a live API key.

## Gitignored Folders

The following are ignored:

- `.env`
- `*.env`
- `data/`
- `outputs/`
- `.tmp/`
- `.venv/`
- `venv/`
- Python cache files

## Upload Restrictions

The backend accepts only:

- PDF
- CSV
- TXT

Uploaded files are saved under `data/<run_id>/`, which is gitignored.

## Data Privacy Warning

Do not upload real personal, customer, bank, payroll, tax, or confidential financial documents in public demos. Use the fake files in `samples/`.

## Financial Advice Disclaimer

FinFlow is a prototype for workflow demonstration and educational review. It does not provide financial, legal, tax, investment, or professional advice.

## Current Security Limitations

- No authentication yet
- No database yet
- No encrypted file storage yet
- No file retention policy yet
- No malware scanning yet
- No production audit logging yet

## Future Security Roadmap

- User authentication
- Role-based access control
- Encrypted storage
- Automatic file expiration
- Audit logs
- Secrets manager integration
- Input scanning and file validation hardening
- Secure deployment configuration
