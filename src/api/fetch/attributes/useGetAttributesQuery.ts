import { useEffect, useState } from 'react';
import { AttributeModel } from './attributesModel';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../services/firebase.config';

export function useGetAttributesQuery() {
  const [attributes, setAttributes] = useState<AttributeModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'attributes', 'data');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const response = docSnap.data() || {};
          const attributesData: AttributeModel[] = Object.values(response);
          setAttributes(attributesData);
        } else {
          setError('Document not found');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    attributes: loading || error ? [] : attributes,
    loading,
    error: error || null,
  };
}
