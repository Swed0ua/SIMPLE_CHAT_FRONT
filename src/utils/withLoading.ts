import { setLoading } from '../store/slices/appSlice';
import { AppDispatch } from '../store/store';

export async function withLoading<T>(
  dispatch: AppDispatch,
  asyncFunc: () => Promise<T>,
): Promise<T> {
  dispatch(setLoading(true));
  try {
    const result = await asyncFunc();
    return result;
  } finally {
    dispatch(setLoading(false));
  }
}
