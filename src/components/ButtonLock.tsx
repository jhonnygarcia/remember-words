import { Button } from 'react-bootstrap';

interface Props {
    name: string;
    loading: boolean;
    withoutIcon?: boolean;
    type: 'button' | 'submit' | 'reset';
    className?: string;
    click?: () => void;
    variant?: string;
    style?: any;
    children?: any;
}
export const ButtonLock = (props: Props) => {
    const className = props.className || '';
    const variant = props.variant || '';
    const withoutIcon = props.withoutIcon || true;
    const onClick = () => {
        if (!props.click) return;
        props.click();
    };
    return (
        <Button
            variant={variant}
            type={props.type}
            disabled={props.loading}
            className={`d-flex align-items-center ${className}`}
            style={props.style || {}}
            onClick={onClick}
        >
            {props.loading && !withoutIcon && (
                <span
                    style={{ marginRight: '0.188rem' }}
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>
            )}
            {props.children}
            {props.name}
        </Button>
    );
};
