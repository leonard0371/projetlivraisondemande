import React from 'react'
import NavBar from '../Navbar/Navbar'
import { FormProvider, useForm } from 'react-hook-form'
import AddSingleProduct from './AddSingleProduct'

const AddProduct = () => {
    const methods = useForm()
    return (
        <>
            <div>
                {/* <NavBar /> */}
                <div className="mt-5 pt-1">
                    <FormProvider {...methods}>
                        <AddSingleProduct />
                    </FormProvider>
                </div>
            </div>
        </>
    )
}

export default AddProduct