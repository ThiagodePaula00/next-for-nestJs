'use client';

import { makeParticialPublicPost, type PublicPost } from '@/src/dto/post/dto';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../Button';
import { InputCheckbox } from '../../InputCheckbox';
import { InputText } from '../../InputText';
import { ImageUploader } from '../ImageUploader';
import { MarkdownEditor } from '../../MarkdownEditor';
import { createPostAction } from '@/src/actions/post/create-post-action';
import { updatePostAction } from '@/src/actions/post/update-post-action';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ManagePostFormProps =
  | {
      mode: 'create';
    }
  | {
      mode: 'update';
      publicPost: PublicPost;
    };

const actions = {
  create: createPostAction,
  update: updatePostAction,
};

export function ManagePostForm(props: ManagePostFormProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const created = searchParams.get('created');
  const publicPost = props.mode === 'update' ? props.publicPost : undefined;
  const initialState = {
    formState: makeParticialPublicPost(publicPost),
    errors: [],
  };

  const [state, action, isPending] = useActionState(actions[props.mode], initialState);
  const { formState } = state;
  const [contentValue, setContentValue] = useState(publicPost?.content ?? '');

  useEffect(() => {
    if (state.success) {
      toast.dismiss();
      toast.success('Post atualizado com sucesso!');
    }
  }, [state.success]);

  useEffect(() => {
    if (created !== '1') return;

    toast.dismiss();
    toast.success('Post criado com sucesso!');

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete('created');
    const query = nextSearchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [created, pathname, router, searchParams]);

  return (
    <form action={action} className='mb-16'>
      <div className='flex flex-col gap-6'>
        <InputText
          labelText='ID'
          name='id'
          placeholder='ID gerado automaticamente'
          type='text'
          defaultValue={formState.id}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText='Slug'
          name='slug'
          placeholder='Slug gerada automaticamente'
          type='text'
          defaultValue={formState.slug}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText='Autor'
          name='author'
          placeholder='Digite o nome do autor'
          type='text'
          defaultValue={formState.author}
          disabled={isPending}
        />

        <InputText
          labelText='Título'
          name='title'
          placeholder='Digite o título'
          type='text'
          defaultValue={formState.title}
          disabled={isPending}
        />

        <InputText
          labelText='Excerto'
          name='excerpt'
          placeholder='Digite o resumo'
          type='text'
          defaultValue={formState.excerpt}
          disabled={isPending}
        />

        <MarkdownEditor
          labelText='Conteúdo'
          value={contentValue}
          setValue={setContentValue}
          textAreaName='content'
          disabled={isPending}
        />

        <ImageUploader disabled={isPending} />

        <InputText
          labelText='URL da imagem de capa'
          name='coverImageUrl'
          placeholder='Digite a url da imagem'
          type='text'
          defaultValue={formState.coverImageUrl}
          disabled={isPending}
        />

        <InputCheckbox
          labelText='Publicar?'
          name='published'
          type='checkbox'
          defaultChecked={formState.published}
          disabled={isPending}
        />

        <div className='mt-4'>
          {state.errors.length > 0 && (
            <ul className='mb-4 list-inside list-disc text-red-700' role='alert'>
              {state.errors.map((error, index) => (
                <li key={`${index}-${error}`}>{error}</li>
              ))}
            </ul>
          )}
          <Button type='submit' disabled={isPending}>Enviar</Button>
        </div>
      </div>
    </form>
  );
}