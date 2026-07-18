import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar';
import type { User } from '@/entities/user/model';

interface UserAvatarProps {
  user: Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Avatar className={sizeMap[size]}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.firstName} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
