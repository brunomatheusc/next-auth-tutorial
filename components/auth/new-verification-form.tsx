"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {
  const params = useSearchParams();
  const token = params.get("token");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token");
      return;
    };

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-ful justify-center">
        { !success && !error && <BeatLoader />}
        
        <FormSuccess message={success} />

        { !success && <FormError message={error} /> }
      </div>
    </CardWrapper>
  );
};