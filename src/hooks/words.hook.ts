import { useMutation, useQuery, useQueryClient } from 'react-query';

import { PagedListDto, WordDto } from '../dto';
import { CreateEditWordDto, WherePagedDto } from './../context/parameters';
import { useAppService } from './../context/app.service';

export const KEY_WORDS = 'words';
export const KEY_WORDS_SINGLE = 'words-single';

export const useMutateWord = (wordId?: string | null, options?: any) => {
    const appService = useAppService();
    return useMutation((data: CreateEditWordDto) => {
        return wordId ? appService.editWord(wordId, data) : appService.addWord(data);
    }, options || {});
};

export const useMutateCompleteWord = (wordId: string, options?: any) => {
    const appService = useAppService();
    return useMutation((complete: boolean) => {
        return appService.editWord(wordId, { complete });
    }, options || {});
};

export const useQueryWord = (wordId: any, options: any) => {
    const appService = useAppService();
    return useQuery<WordDto>(
        [KEY_WORDS_SINGLE, wordId],
        () => appService.getWord(wordId).then((res) => res.data as WordDto),
        options
    );
};

export const useQueryWords = (queryParameters: () => WherePagedDto, options?: any) => {
    const queryFunction = () => {
        const appService = useAppService();
        const payload = queryParameters();
        return appService.getWords(payload).then((res) => res.data as PagedListDto<WordDto>);
    };
    return useQuery<PagedListDto<WordDto>>([KEY_WORDS], queryFunction, options || {});
};
