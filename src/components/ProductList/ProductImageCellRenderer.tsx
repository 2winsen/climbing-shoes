import { ICellRendererParams } from 'ag-grid-community';
import { useEffect, useState } from 'react';
import { Product } from '../../types';
import { withProxy } from '../../utils';

export function ProductImageCellRenderer(props: ICellRendererParams<Product>) {
  const [imageUrl, setImageUrl] = useState('IMAGE_NOT_FOUND');

  /**
   * Workaround to get image via proxy
   * Not possible to pass necessary proxy-anywhere headers by default with img src
   */
  useEffect(() => {
    const imageUrl = props.data?.imageUrl ?? 'IMAGE_NOT_FOUND';
    fetch(withProxy(imageUrl), {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        setImageUrl(URL.createObjectURL(blob));
      })
      .catch((err) => console.error('Failed to load image:', err));
  }, [props.data?.imageUrl]);

  return (
    <a target="_blank" rel="noopener noreferrer" href={props.data?.sellerUrl}>
      <img src={imageUrl} style={{ width: '90px' }} />
    </a>
  );
}
