import clsx from 'clsx';

interface TextCardProps {
    heading: string,
    description: string,
    badgeContent?: string
    className?: string
}
const TextCard: React.FC<TextCardProps> = ({ heading, description, badgeContent, className }) => {
    return (
        <div className={clsx("flex flex-col text-white rounded-lg bg-primary w-full p-2 relative", className)}>
            <h3 className="text-lg font-medium ">{heading}</h3>
            <p className="text-sm">{description}</p>
            {badgeContent && <span className="mt-2 absolute right-1 top-0 px-3 py-1 text-xs font-medium text-black bg-green-100 border shadow-sm rounded-md">
                {badgeContent}
            </span>}
        </div>
    );
};

export default TextCard;
