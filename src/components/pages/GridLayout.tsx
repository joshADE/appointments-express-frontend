import React, { useEffect, useRef, useState } from 'react';
import { SkewLoader } from 'react-spinners';
import ErrorPage, { ErrorType } from './ErrorPage';

type T<K extends string, C> = {[key in K]: C};
const getValueOf = <K extends string, C> (key: K, map: {[key in K]: C}) =>  {
    return map[key];
}
interface GridLayoutProps<K extends string, C> {
    // the classes assigned to the grid
    className?: string;
    children: (() => {
        key: keyof T<K,C>;
        node: React.ReactNode | ((data: ReturnType<typeof getValueOf>) => JSX.Element);
        className?: string;
        resize?: { width?: boolean; height?: boolean };
    }[]);
    data?: T<K,C>;
    childrenDataLoading: boolean;
    childrenDataFetching: boolean;
    errors: ErrorType[];
    layoutRefreshTriger: number;

}

//  gap-4 grid-cols-1 md:grid-cols-4 


const GridLayout: <K extends string, C>(props: GridLayoutProps<K,C>) => JSX.Element = ({
    className,
    children,
    childrenDataLoading,
    childrenDataFetching,
    errors,
    data,
    layoutRefreshTriger,
}) => {
    const someErrors = errors.some(error => error !== undefined);
    const refs = useRef<{[key: string]:HTMLDivElement | null}>({});
    const [, setReflows] = useState(0);
    useEffect(() => {
        setReflows(r => r + 1);
    }, [layoutRefreshTriger])

    useEffect(() => {
        const resizeHandler = () => {
            setReflows(r => r + 1);
        }
        window.addEventListener("resize", resizeHandler);
        return () => {
            window.removeEventListener("resize", resizeHandler);
        }
    }, [])

    return (
        <div className={`grid mt-5 ${childrenDataLoading || someErrors ? 'grid-cols-1 grid-rows-1': className}`}>
            <div className="fixed right-10 bottom-10 z-50">
                {childrenDataFetching && <SkewLoader color="#333" loading={childrenDataFetching} size="20px" />}
            </div>

            {childrenDataLoading ? (
                <div className="col-span-1 row-span-1 flex justify-center items-center h-full">
                    <SkewLoader color="#333" loading={childrenDataLoading} size="36px" />
                </div>
            ) : someErrors ? (
                <div className="col-span-1 row-span-1">
                    <ErrorPage 
                        errors={errors}
                    />
                </div>
            ) : (
            <>
                {children().map((child) => {
                    const { key, node, className, resize } = child;
                    const div = refs.current[key];

                    const transitions  = [];
                    if (resize?.height)
                        transitions.push('height', 'max-height', 'min-height');

                    if (resize?.width)
                        transitions.push('width', 'max-width', 'min-width');

                    if (!resize?.height && !resize?.width)
                        transitions.push('none');

                    
                    const dimentions: any = div ? {
                        width: resize?.width ? div.offsetWidth: '100%',
                    }: undefined;

                    if (div && resize?.height){
                        dimentions.height = div.clientHeight;
                        dimentions.minHeight = div.scrollHeight;
                    } else {
                        if(div){
                            dimentions.minHeight = div.clientHeight;
                        }
                    }

                    if (div && resize?.width){
                        dimentions.width = div.clientWidth;
                        dimentions.minWidth = div.scrollWidth;
                    }


                    return (
                        <div key={key} className={className + ' bg-white rounded-lg shadow overflow-hidden duration-200 ease-linear relative'} style={{ ...dimentions, transitionProperty: transitions.join(', ')}}>
                            <div style={!resize?.width ? {width: "calc(100%)"} : undefined} className="absolute p-5" ref={(element) => refs.current[key] = element}>
                                {typeof node === 'function' ? (data === undefined || data[key] === undefined ? 'No data to display': node(getValueOf(key, data))) : node}
                            </div>
                        </div>)
                
                })}
            </>
            )} 
        </div>
    );
}

export default GridLayout;