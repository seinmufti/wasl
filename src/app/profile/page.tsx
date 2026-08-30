"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { CompanyMark } from "@/components/company-mark";
import { FloatingLabelInput } from "@/components/floating-label-input";
import { PageShell } from "@/components/page-shell";
import { SignaturePad } from "@/components/signature-pad";
import { useSettings } from "@/components/settings-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fileToDataUrl } from "@/lib/export";
import { cn } from "@/lib/utils";

type CompanyDraft = {
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string | null;
  companySignature: string | null;
};

function draftsEqual(a: CompanyDraft, b: CompanyDraft) {
  return (
    a.companyName === b.companyName &&
    a.companyPhone === b.companyPhone &&
    a.companyEmail === b.companyEmail &&
    a.companyLogo === b.companyLogo &&
    a.companySignature === b.companySignature
  );
}

export default function ProfilePage() {
  const {
    t,
    ready,
    companyName,
    companyPhone,
    companyEmail,
    companyLogo,
    companySignature,
    updateCompanyProfile,
  } = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<CompanyDraft>({
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    companyLogo: null,
    companySignature: null,
  });
  const [savedDraft, setSavedDraft] = useState<CompanyDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!ready || savedDraft) return;
    const snapshot = {
      companyName,
      companyPhone,
      companyEmail,
      companyLogo,
      companySignature,
    };
    setDraft(snapshot);
    setSavedDraft(snapshot);
  }, [
    ready,
    companyName,
    companyPhone,
    companyEmail,
    companyLogo,
    companySignature,
    savedDraft,
  ]);

  const isDirty = savedDraft ? !draftsEqual(draft, savedDraft) : false;

  useEffect(() => {
    if (isDirty) setShowSaved(false);
  }, [isDirty]);

  async function onLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const dataUrl = await fileToDataUrl(file, 1600);
    setDraft((current) => ({ ...current, companyLogo: dataUrl }));
  }

  async function onSave() {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await updateCompanyProfile(draft);
      setSavedDraft(draft);
      setShowSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell
      footer={
        <Button
          type="button"
          className={cn(
            "w-full",
            showSaved &&
              !isDirty &&
              "bg-green-600 text-white hover:bg-green-600 active:bg-green-600",
          )}
          disabled={!isDirty || saving}
          onClick={() => void onSave()}
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" />
              {t("saving")}
            </>
          ) : showSaved && !isDirty ? (
            <>
              <Check />
              {t("saved")}
            </>
          ) : (
            t("save")
          )}
        </Button>
      }
    >
      <div className="space-y-6">
        <p className="text-base text-muted-foreground">{t("companyProfileHint")}</p>

        <section className="space-y-3">
          <Label>{t("companyLogo")}</Label>
          <div className="flex items-center gap-3">
            {draft.companyLogo ? (
              <CompanyMark
                src={draft.companyLogo}
                className="max-h-12 w-auto max-w-[9rem] shrink-0 rounded-lg border object-contain"
              />
            ) : (
              <div
                className="h-12 w-24 shrink-0 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30"
                aria-hidden
              />
            )}
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                {t("uploadLogo")}
              </Button>
              {draft.companyLogo ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setDraft((current) => ({ ...current, companyLogo: null }))
                  }
                >
                  {t("removeLogo")}
                </Button>
              ) : null}
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onLogoChange}
          />
        </section>

        <section className="space-y-3">
          <FloatingLabelInput
            id="company-name"
            label={t("companyName")}
            value={draft.companyName}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                companyName: event.target.value,
              }))
            }
          />
          <FloatingLabelInput
            id="company-phone"
            label={t("phone")}
            type="tel"
            value={draft.companyPhone}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                companyPhone: event.target.value,
              }))
            }
            autoComplete="tel"
          />
          <FloatingLabelInput
            id="company-email"
            label={t("companyEmail")}
            type="email"
            value={draft.companyEmail}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                companyEmail: event.target.value,
              }))
            }
            autoComplete="email"
          />
        </section>

        <section className="space-y-3">
          <Label>{t("signature")}</Label>
          <SignaturePad
            value={draft.companySignature}
            clearLabel={t("clearSignature")}
            onChange={(companySignature) =>
              setDraft((current) => ({ ...current, companySignature }))
            }
          />
        </section>
      </div>
    </PageShell>
  );
}
