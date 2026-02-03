"use client"

import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/actions/categories";

export function CategoryForm(){

    const [ onpen, setOpen ] = useState(false);

    return(
        <Dialog open={onpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-brand-primary hover:bg-brand-primary font-semibold">
                    <Plus className="mr-2 h-5 w-5"/>
                    Nova Categoria
                </button>
            </DialogTrigger>

            <DialogContent className="p-6 bg-app-card text-white">
                <DialogHeader>
                    <DialogTitle>Criar nova categoria</DialogTitle>
                    <DialogDescription>Insira os dados da nova categoria</DialogDescription>
                </DialogHeader>

                <form className="space-y-4" action={createCategoryAction}>
                    <div>
                        <Label htmlFor="category" className="mb-2">Nome da categoria</Label>
                        <Input id="name" name="name" placeholder="Nome da categoria" className="border-app-border bg-app-background text-white"/>
                    </div>

                    <Button type="submit" className="w-full bg-brand-primary text-white hover:bg-brand-primary">Criar categoria</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}