import { useMutation, useQuery } from 'react-query';
import { UserConfigDto } from '../dto';
import { useAppService } from '../context/app.service';
import { SaveConfigDto } from '../context/parameters';

export const KEY_CONFIG = 'config';

export const useMutateConfig = () => {
    const appService = useAppService();
    return useMutation((data: SaveConfigDto) => {
        return appService.saveUserConfig(data);
    });
};

export const useQueryConfig = (options?: any) => {
    const appService = useAppService();
    return useQuery<UserConfigDto>([KEY_CONFIG], () =>
        appService.getUserConfig().then((res) => res.data as UserConfigDto),
        options
    );
};
