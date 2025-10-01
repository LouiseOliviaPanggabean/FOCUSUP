import React, { useState } from 'react';

interface SubmitTipFormProps {
    onAddTip: (content: string, imageUrl?: string) => void;
}

const SubmitTipForm: React.FC<SubmitTipFormProps> = ({ onAddTip }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | undefined>(undefined);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length < 10) {
            setError('Tip must be at least 10 characters long.');
            return;
        }
        setError('');
        onAddTip(content, image);
        setContent('');
        setImage(undefined);
        // Clear the file input
        const fileInput = document.getElementById('tip-image-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-danger text-sm">{error}</p>}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a tip, a resource, or a motivational thought..."
                className="w-full p-2 border rounded-md bg-light dark:bg-dark-bg border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
                rows={3}
            />
            <div className="flex items-center justify-between">
                <input
                    id="tip-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-muted dark:text-dark-muted
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-primary-light file:text-primary
                               dark:file:bg-primary/20
                               hover:file:bg-primary-light/80 dark:hover:file:bg-primary/30"
                />
                <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors">
                    Share
                </button>
            </div>
            {image && (
                <div className="mt-2">
                    <p className="text-sm text-muted dark:text-dark-muted mb-1">Image Preview:</p>
                    <img src={image} alt="Preview" className="max-h-40 rounded-lg border dark:border-gray-600" />
                </div>
            )}
        </form>
    );
};

export default SubmitTipForm;
