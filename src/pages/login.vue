<script lang="ts">
export const description
    = 'A simple login form with email and password. The submit button says \'Sign in\'.'
export const iframeHeight = '600px'
export const containerClass = 'w-full h-screen flex items-center justify-center px-4'
</script>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
</script>

<template>
    <Card class="w-full max-w-sm">
        <CardHeader>
            <CardTitle class="text-2xl">
                Entrar
            </CardTitle>
            <CardDescription>
                Entre e realize o teste no sistema
            </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" value="testeshipsmart@global" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-2">
                <Label for="password">Senha</Label>
                <Input id="password" value="123456" type="password" required />
            </div>
        </CardContent>
        <CardFooter>
            <Button class="w-full" as-child>
                <a href="/contatos">
                    Entrar
                </a>
            </Button>
        </CardFooter>
    </Card>
</template>
