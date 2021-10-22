import React, { memo, Ref } from 'react'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'

const className = "border border-gray-400 p-2";

const RolesSection = React.forwardRef((props, ref: Ref<HTMLDivElement>) => {

        return (<section id="roles" className="font-roboto text-gray-900">
            <div ref={ref} className="py-20 mx-auto container px-10 overflow-hidden">
            <h3 className="text-green-500 text-center font-semibold text-sm">Roles</h3>
                    <h2 className="text-center font-black font-open-sans text-gray-900 text-4xl">What permissions do the different roles have?</h2>
                    <div className="flex justify-center items-center my-32">
                        <table className="text-left font-normal table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className={className}></th>
                                    <th className={className}>Owners</th>
                                    <th className={className}>Managers</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className={className}>Can create a store</th>
                                    <CheckedTableData />
                                    <CheckedTableData />
                                </tr>
                                <tr>
                                    <th className={className}>Can edit store details</th>
                                    <CheckedTableData />
                                    <td className={className}></td>
                                </tr>
                                <tr>
                                    <th className={className}>Can edit store hours</th>
                                    <CheckedTableData />
                                    <CheckedTableData />
                                </tr>
                                <tr>
                                    <th className={className}>Can edit store closed days and times</th>
                                    <CheckedTableData />
                                    <CheckedTableData />
                                </tr>
                                <tr>
                                    <th className={className}>Can delete the created store</th>
                                    <CheckedTableData />
                                    <td className={className}></td>
                                </tr>
                                <tr>
                                    <th className={className}>Can assign managers for a store</th>
                                    <CheckedTableData />
                                    <td className={className}></td>
                                </tr>
                                <tr>
                                    <th className={className}>Can manage store appointments</th>
                                    <CheckedTableData />
                                    <CheckedTableData />
                                </tr>
                            </tbody>
                        </table>

                    </div>
            </div>
        </section>);
});

export default memo(RolesSection);

const CheckedTableData: React.FC = () => {
    return (
        <td className={`${className} relative`}>
            <IoIosCheckmarkCircleOutline className="text-2xl text-green-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </td>
    )
}