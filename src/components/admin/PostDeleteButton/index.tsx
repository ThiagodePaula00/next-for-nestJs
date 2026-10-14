'use client'

import { deletePostAction } from "@/src/actions/post/delete-post-action";
import { Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { Dialog } from "../../Dialog";
import { toast } from "react-toastify";

type DelelePostButtonProps = {
    id: string;
    title: string;
};


export function DelelePostButton({id, title}: DelelePostButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [showDialog, setShowDialog] = useState(false);

    function handleClick() {
        setShowDialog(true);
    }

    function handleConfirm() {
        toast.dismiss();

        startTransition(async () => {
            const result = await deletePostAction(id)
            setShowDialog(false);

            if(result.error) {
                toast.error(result.error);
                return
            }

            toast.success('post apagado com sucesso')
        });

    }

    return (
    <>
        <button className="text-red-500 cursor-pointer transition [&_svg]:w-4 [&_svg]:h-4 hover:scale-120 hover:text-red-700 disabled:text-slate-600 disabled:cursor-not-allowed"
            aria-label={`Apagar post: ${title}`}
            title={`Apagar post: ${title}`}
            onClick={handleClick}
            disabled={isPending}
            >
                <Trash2Icon />
        </button>
        {showDialog && (
            <Dialog 
                isVisible={showDialog} title="Apagar post" content={`Tem certeza que deseja apagar o post: ${title}?`} 
                onCancel={() => setShowDialog(false)}
                onConfirm={handleConfirm}
                disabled={isPending}
        />
        )}
    </>
    );
}