import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { PagedListDto, WordDto } from '../dto';
import { helper } from '../common/helpers.function';
import { CreateEditWordDto } from './../context/parameters';
import { useAppService } from './../context/app.service';

const KEY_WORDS = 'words';


export const useMutateWord = (wordId?: string | null) => {
    const appService = useAppService();
    const queryClient = useQueryClient();
    return useMutation(
        (data: CreateEditWordDto) => {
            return wordId ? appService.editWord(wordId, data) : appService.addWord(data);
        },
        {
            onSuccess: () => {
                toast.success('Operación realizada exitosamente');
                queryClient.invalidateQueries(KEY_WORDS);
            },
            onError: (res: any) => {
                helper.showMessageResponseError('warn', {
                    response: res.response,
                    statusCodes: [404, 400],
                });
            },
        },
    );
};

export const useQueryWord = (wordId: any, options: any) => {
    const appService = useAppService();
    return useQuery<WordDto>(
        [KEY_WORDS, wordId],
        () => appService.getWord(wordId).then((res) => res.data as WordDto),
        options);
}

export const useQueryWords = (search: string) => {
    const appService = useAppService();
    return useQuery<PagedListDto<WordDto>>([KEY_WORDS], () => {
        const payload = {
            search: search,
            page: 1,
            perPage: 100,
        };
        return appService.getWords(payload).then((res) => res.data as PagedListDto<WordDto>);
    });
}