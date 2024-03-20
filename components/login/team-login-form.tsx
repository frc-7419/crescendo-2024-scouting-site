'use client'

import logoLight from '@/resources/7419light.svg'
import logoDark from '@/resources/7419dark.svg'
import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {signIn, useSession} from "next-auth/react";
import {useTheme} from "next-themes";
import {toast} from 'react-hot-toast';
import {LoadStatusContext} from '../loading/LoadStatusContext';
import Image from 'next/image';

import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,} from "@/components/ui/input-otp"
import {REGEXP_ONLY_DIGITS_AND_CHARS} from "input-otp";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"

import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

const FormSchema = z.object({
    code: z.string().min(8, {
        message: "Your invite code must be 8 characters.",
    }),
})


export default function TeamLoginForm() {
    const router = useRouter();

    const {setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [isDark, setIsDark] = useState(false);
    const {theme} = useTheme();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        setIsDark(theme === 'dark');
    }, [theme]);

    const {status} = useSession();

    useEffect(() => {
        if (status == "authenticated") router.push("/dashboard");
    }, [status]);

    useEffect(() => {
        setValue(100);
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            code: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        signIn("team-login", {
            redirect: false,
            code: data.code,
        }).then((resp) => {
            if (resp?.error) {
                toast.error(resp.error);
                setIsAuthenticating(false);
                console.error(resp.error);
                setValue(500);
            } else {
                setValue(100);
                toast.success("Logged in successfully. Redirecting...");
            }
        });
    }

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    className="mx-auto h-12"
                    src={isDark ? logoLight.src : logoDark.src}
                    alt="Tech Support"
                    width={logoLight.width}
                    height={logoLight.height}
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                    FRC Team 7419 Scouting App
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full grid place-items-center">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Invite Code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}  {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0}/>
                                                <InputOTPSlot index={1}/>
                                                <InputOTPSlot index={2}/>
                                                <InputOTPSlot index={3}/>
                                            </InputOTPGroup>
                                            <InputOTPSeparator/>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={4}/>
                                                <InputOTPSlot index={5}/>
                                                <InputOTPSlot index={6}/>
                                                <InputOTPSlot index={7}/>
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <button
                            type="submit"
                            disabled={isAuthenticating} // Disable button when authenticating
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-600"
                        >
                            Confirm
                        </button>
                    </form>
                </Form>
            </div>
        </>
    );
};