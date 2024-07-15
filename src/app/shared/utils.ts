import { PageControl } from "@model/application";

export class Utils {

    static toBase64(file: File): Promise<string | ArrayBuffer> {
        return new Promise((resolve: any, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        })
      }
	static isMobile() {
		return window && window.matchMedia('(max-width: 767px)').matches;
	}

	static mountPageControl(pageControl: PageControl): string {
		let result = '';

		if (!pageControl) {
			return result;
		}

		Object.entries(pageControl).forEach(([key, value]) => {
			result += `${key}=${value}&`;
		});

		return result;
	}

	static filterAutocomplete(items:any, value:any, field = 'name', field2 = '') {
        if (typeof value === 'string' && items.length) {
            const filterValue = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            return items.filter((option: any) => {
                return (
                    filterValue === '' ||
                    String(field2 ? option[field][field2] : option[field])
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .includes(filterValue)
                );
            });
        }
    }

    static capitalizeCase(str: string): string {
        let result: string = '';

        str.split(' ').forEach((word, index) => {
            if (index) {
                result += ` ${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`;
                return
            }
            result += `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`;
        })

        return result;
    }
}
