"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";

import { LoginSchema } from "@/schemas";

import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { login } from "@/actions/login";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
   ? "Email is already in use with other provider" : "";

  const [isPending, startTransition] = useTransition();

  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [sucessMessage, setSucessMessage] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setErrorMessage("");
    setSucessMessage("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setErrorMessage(data.error);
          }

          if (data?.success) {
            form.reset();
            setSucessMessage(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setErrorMessage("Something went wrong"))
      ;
    });
  }

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            { showTwoFactor && (
              <FormField 
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>

                    <FormControl>
                      <Input 
                        {...field}
                        type="text" 
                        placeholder="123456"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            { !showTwoFactor &&
            <>
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email" 
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>

                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/auth/reset">
                        Forgot Password
                      </Link>
                    </Button>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            }
          </div>

          <FormError message={errorMessage || urlError} />
          <FormSuccess message={sucessMessage} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};