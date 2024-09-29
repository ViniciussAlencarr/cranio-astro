import { useEffect, useState } from "react"

export const IdentificationForm = () => {
    const [email, setEmail] = useState<string | undefined>()

    useEffect(() => {
        const emailStorage = localStorage.getItem('email') as string
        setEmail(emailStorage)
    }, [])
    const onSubmit = (event: any) => {
        event.preventDefault()
        window.location.href = `${window.location.origin}/carrinho/pagamento`
    }

    return (
        <form onSubmit={onSubmit} className="mt-3 md:mt-6 flex flex-col md:flex-row items-center justify-center w-full">
            <div className="w-full md:w-fit">
                <input
                    required
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    type="email"
                    placeholder="Digite o seu email"
                    className=" py-2 px-8 rounded-full w-full md:w-auto bg-none bg-transparent outline-none border border-[#969696] min-w-auto md:min-w-[400px] 2xl:min-w-[600px] text-[14px] md:text-[16px] 2xl:text-[20px]" />
            </div>
            <div className="ml-3 md:ml-6 mt-3 md:mt-0">
                <button type="submit" className="bg-[#EE8A21] text-white py-2 px-8 rounded-full text-[14px] md:text-[16px] 2xl:text-[20px]">Continuar</button>
            </div>
        </form>
    )
}