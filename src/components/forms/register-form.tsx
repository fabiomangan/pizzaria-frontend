import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function RegisterForm(){
    return(
        <Card className="bg-app-card border border-app-border w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-white text-center text-3xl sm:text-4xl font-bold">
                    Sujeito<span className="text-brand-primary">Pizza</span>
                </CardTitle>
                <CardContent>
                    <form className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Nome</Label>
                            <Input type="text" id="name" placeholder="Digite seu nome" required minLength={3} className="text-white bg-app-card border border-app-border"/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Email</Label>
                            <Input type="email" id="email" placeholder="Digite seu email" required className="text-white bg-app-card border border-app-border"/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="senha" className="text-white">Senha</Label>
                            <Input type="password" id="password" placeholder="Digite sua senha" required className="text-white bg-app-card border border-app-border"/>
                        </div>

                        <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">Cadastrar</Button>

                    </form>
                </CardContent>
            </CardHeader>
        </Card>
    );
}