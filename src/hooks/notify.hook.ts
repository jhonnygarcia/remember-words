import { useMutation, useQuery } from 'react-query';
import { useAppService } from '../context/app.service';
import { WherePagedDto } from '../context/parameters';
import { PagedListDto } from '../dto';
import { NotificationDto } from '../dto/notification.dto';

const KEY_NOTIFICATIONS = 'notifications';
const KEY_NOTIFICATION = 'notification';

export const useQueryNotifications = (queryFn: () => WherePagedDto, options?: any) => {
    const appService = useAppService();
    const payload = queryFn();
    return useQuery<PagedListDto<NotificationDto>>(
        [KEY_NOTIFICATIONS],
        () => {
            return appService.getNotifications(payload).then((res) => res.data as PagedListDto<NotificationDto>);
        },
        options || {}
    );
};

export const useQueryNotification = (notificationId: string, options?: any) => {
    const appService = useAppService();
    return useQuery<NotificationDto>(
        [KEY_NOTIFICATION, notificationId],
        () => appService.getNotification(notificationId).then((res) => res.data as NotificationDto),
        options || {}
    );
};

export const useMutateSendNofity = (options?: any) => {
    const appService = useAppService();
    return useMutation((data: { userId: string; title: string; message: string }) => {
        return appService.pushNotify(data.userId, data.title, data.message);
    }, options || {});
};

export const useMutateBrandNotification = (options?: any) => {
    const appService = useAppService();
    return useMutation((id: string) => {
        return appService.brandShowNotification(id);
    }, options || {});
};

export const useMutateSendAllNofity = (options?: any) => {
    const appService = useAppService();
    return useMutation((data: { title: string; message: string }) => {
        return appService.pushAllNotify(data.title, data.message);
    }, options || {});
};
