import { Check, Star, StarHalf, X } from "phosphor-react";
import { CancelButton, ConfirmButton, FormError, UserRatingContainer } from "./styles";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar } from "../Avatar";

const userRatingForm = z.object({
    review: z.string()
})

type UserRatingFormData = z.infer<typeof userRatingForm>

export interface UserRatingSubmitData extends UserRatingFormData {
    rate: number
}

type UserRatingFormProps = {
    handleRatingSubmit: (data: UserRatingSubmitData) => void
    handleCloseUserRatingForm: () => void
    avatarUrl?: string
    userName?: string
    profile?: boolean
    initialRate?: number | null
    initialReview?: string
}

export function UserRatingForm(
    {profile = false, 
        handleRatingSubmit, 
        handleCloseUserRatingForm, 
        avatarUrl, 
        userName,
        initialRate = null,
        initialReview = ''
    }: UserRatingFormProps
){

    const [rateHover, setRateHover] = useState(0)
    
    const [definedRate, setDefinedRate] = useState<number | null>(initialRate)

    const [isError, setIsError] = useState(false)

    const { register, handleSubmit, reset, setFocus } = useForm<UserRatingFormData>({
        defaultValues: {
            review: initialReview
        }
    })

    function handleDefineRate(index: number) {

        if (definedRate === index) {
            return setDefinedRate(null)
        }

        if (index) {

            return setDefinedRate(index)
        }
    }

    function handleMouseOver(index: number, e: React.MouseEvent<HTMLDivElement>) {

        const { left, width } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const half = width / 2;
        const isHalf = x > half;
        const value = index + (isHalf ? 1 : 0.5);

        setRateHover(value)
    }

    function handleRate() {
    
            const value = definedRate ?? rateHover
    
            const starRate = Array.from({ length: 5 })
    
            return starRate.map((_, i) => {
    
                if (value >= i + 1) {
    
                    return (
                        <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseLeave={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i, e)}>
                            <Star weight='fill' />
                        </div>
                    )
                } else if (value >= i + 0.5) {
                    return (
                        <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseOut={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i, e)}>
                            <StarHalf weight='fill' />
                        </div>
                    )
                } else {
                    return (
                        <div key={i} onClick={() => handleDefineRate(rateHover)} onMouseOut={() => setRateHover(0)} onMouseOver={(e) => handleMouseOver(i, e)}>
                            <Star weight='regular' />
                        </div>
                    )
                }
    
            })
    }

    function onSubmit(data: UserRatingFormData){

        if(!definedRate){
            return setIsError(true)
        }

        handleRatingSubmit({review: data.review, rate: definedRate})

        reset()
        setDefinedRate(null)
        return
    }

    useEffect(() => {
        setFocus('review')
    }, [])

    return (
         <UserRatingContainer>
            <div>
                <span>
                    {
                        
                        !profile && (
                            <>
                                <Avatar width={40} height={40} userName={userName  ?? 'User'} src={avatarUrl}/>
                                <h2>{userName}</h2>
                        </>
                        )  
                    }
                </span>
                
                <span>

                    <span>
                        {handleRate()}
                    </span>

                    <span>

                        <FormError isError={isError}>Selecione uma nota.</FormError>

                    </span>

                </span>

            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <textarea maxLength={400} wrap="hard" {...register('review')} placeholder="Escreva sua avaliação" />
                <span>
                    <CancelButton type="button" onClick={() => handleCloseUserRatingForm()}>
                        <X />
                    </CancelButton>

                    <ConfirmButton type="submit">
                        <Check />
                    </ConfirmButton>
                </span>
            </form>
        </UserRatingContainer>
    )
}