"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// ─── Google icon SVG ─────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Magic link icon ─────────────────────────────────────────────────────────
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

// ─── CheckCircle icon ────────────────────────────────────────────────────────
function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleGoogle() {
    setGoogleLoading(true);
    setErrorMsg(null);
    const { error } = await loginWithGoogle();
    if (error) {
      setErrorMsg(error.message);
      setGoogleLoading(false);
    }
    // On success the browser navigates away — no need to reset state
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      emailRef.current?.focus();
      return;
    }
    setEmailLoading(true);
    setErrorMsg(null);
    const { error } = await loginWithEmail(email.trim());
    setEmailLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setEmailSent(true);
    }
  }

  return (
    <>
      {/* Background gradients */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: "#0a0a0f",
          overflow: "hidden",
        }}
      >
        {/* Top-left glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "50vw",
            height: "50vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Bottom-right glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-5%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Logo / wordmark */}
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
            <Image 
              src="/logo.svg" 
              alt="Kynda Do Logo" 
              width={48} 
              height={48} 
              className="object-contain"
            />
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#f5f5f5",
                letterSpacing: "-0.5px",
              }}
            >
              Kynda Do
            </span>
          </div>
        </div>

        {/* Card */}
        <div
          id="login-card"
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "rgba(26,26,26,0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "36px 32px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#f5f5f5",
              marginBottom: "6px",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#71717a",
              marginBottom: "28px",
              lineHeight: 1.5,
            }}
          >
            Your tasks stay local.{" "}
            <span style={{ color: "#a1a1aa" }}>Login to sync across devices.</span>
          </p>

          {/* Error banner */}
          {errorMsg && (
            <div
              role="alert"
              style={{
                marginBottom: "20px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
                fontSize: "13px",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Magic link success state */}
          {emailSent ? (
            <div
              id="magic-link-sent"
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <div style={{ color: "#4ade80", marginBottom: "10px" }}>
                <CheckCircleIcon />
              </div>
              <p style={{ fontSize: "14px", color: "#86efac", fontWeight: 500 }}>
                Magic link sent!
              </p>
              <p style={{ fontSize: "13px", color: "#71717a", marginTop: "6px" }}>
                Check your inbox at <strong style={{ color: "#a1a1aa" }}>{email}</strong> and
                click the link to sign in.
              </p>
              <button
                onClick={() => { setEmailSent(false); setEmail(""); }}
                style={{
                  marginTop: "14px",
                  fontSize: "13px",
                  color: "#7c3aed",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              {/* Google OAuth button */}
              <button
                id="btn-google-login"
                onClick={handleGoogle}
                disabled={googleLoading || emailLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#f5f5f5",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: googleLoading ? "not-allowed" : "pointer",
                  opacity: googleLoading ? 0.6 : 1,
                  transition: "background 0.15s, border-color 0.15s, transform 0.1s",
                  marginBottom: "12px",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!googleLoading)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.09)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.05)";
                }}
              >
                {googleLoading ? <Spinner /> : <GoogleIcon />}
                Continue with Google
              </button>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  margin: "20px 0",
                }}
              >
                <div
                  style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }}
                />
                <span style={{ fontSize: "12px", color: "#52525b" }}>or</span>
                <div
                  style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }}
                />
              </div>

              {/* Magic link form */}
              <form id="form-magic-link" onSubmit={handleEmailLogin} noValidate>
                <label
                  htmlFor="input-email"
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: "#a1a1aa",
                    marginBottom: "8px",
                    fontWeight: 500,
                  }}
                >
                  Email address
                </label>
                <input
                  id="input-email"
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={emailLoading}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#f5f5f5",
                    fontSize: "14px",
                    outline: "none",
                    marginBottom: "12px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
                <button
                  id="btn-email-login"
                  type="submit"
                  disabled={emailLoading || googleLoading}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: emailLoading ? "not-allowed" : "pointer",
                    opacity: emailLoading ? 0.7 : 1,
                    transition: "opacity 0.15s, transform 0.1s",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!emailLoading)
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 6px 24px rgba(124,58,237,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 20px rgba(124,58,237,0.3)";
                  }}
                >
                  {emailLoading ? <Spinner /> : <MailIcon />}
                  Continue with Email
                </button>
              </form>
            </>
          )}

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.06)",
              margin: "24px 0",
            }}
          />

          {/* Use without account */}
          <Link
            id="link-use-without-account"
            href="/dashboard"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: "13px",
              color: "#52525b",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#a1a1aa";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#52525b";
            }}
          >
            Or use without account →
          </Link>
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#3f3f46",
            textAlign: "center",
          }}
        >
          No password required. We use magic links &amp; OAuth.
        </p>
      </main>
    </>
  );
}
