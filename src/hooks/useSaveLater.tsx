import { useRouter } from 'next/router';
import { useAuthContext } from '@/utils/auth/auth-provider';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useSaveLater = (booking: any, url: string) => {

    const [isSuccess, setIsSuccess] = useState(false);
    const { user } = useAuthContext();
    const router = useRouter();

    const handleSaveLater = async () => {
        if (!user) {
            return router.replace('/authenticate?callbackUrl=/booking/new?tour=' + url);
        }

        const db = getFirestore();

        try {
            await addDoc(collection(db, 'savedBooking'), {
                ...booking,
                uid: user.uid,
            });
            setIsSuccess(true);
            router.push('#success')

        } catch (error) {
            console.error('Error saving booking:', error);
        }
    };



    return { handleSaveLater, isSuccess };
};

export default useSaveLater;
