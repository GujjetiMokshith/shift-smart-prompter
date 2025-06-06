import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Brain, Rocket, Clock, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-blue">How It Works</h2>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto">
                        Transform your prompts in three simple steps with our AI-powered enhancement engine
                    </p>
                </div>
                
                <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Brain}
                                title="01 - Input Your Prompt"
                                description="Paste your basic prompt or idea into our intuitive interface powered by advanced AI."
                            />
                        </CardHeader>

                        <div className="relative mb-6 border-t border-dashed sm:mb-0">
                            <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,hsl(var(--muted)),white_125%)]"></div>
                            <div className="aspect-[76/59] p-1 px-6">
                                <DualModeImage
                                    darkSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
                                    lightSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
                                    alt="AI prompt input interface"
                                    width={800}
                                    height={600}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Rocket}
                                title="02 - AI Enhancement"
                                description="Our advanced AI analyzes and enhances your prompt with detailed specifications."
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                                <div className="aspect-[76/59] border">
                                    <DualModeImage
                                        darkSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
                                        lightSrc="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
                                        alt="AI processing and enhancement"
                                        width={800}
                                        height={600}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">Get optimized prompts ready for any AI model in seconds.</p>

                        <div className="flex justify-center gap-6 overflow-hidden">
                            <CircularUI
                                label="Llama 3.3"
                                circles={[{ pattern: 'border' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Claude"
                                circles={[{ pattern: 'blue' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="ChatGPT"
                                circles={[{ pattern: 'primary' }, { pattern: 'blue' }]}
                            />

                            <CircularUI
                                label="Mistral"
                                circles={[{ pattern: 'border' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5 bg-[#030712]/90 backdrop-blur-xl border border-white/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-blue-500 absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-blue-500 absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-blue-500 absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-blue-500 absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-blue-400 flex items-center gap-2 font-medium">
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold text-white">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <>
        <img
            src={darkSrc}
            className={cn('hidden dark:block rounded-lg', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
        />
        <img
            src={lightSrc}
            className={cn('shadow dark:hidden rounded-lg', className)}
            alt={`${alt} light`}
            width={width}
            height={height}
        />
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-gradient-to-b from-blue-500/20 size-fit rounded-2xl to-transparent p-px">
            <div className="bg-gradient-to-b from-[#030712] to-blue-900/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-blue-500': circle.pattern === 'none',
                            'border-blue-500 bg-[repeating-linear-gradient(-45deg,rgba(59,130,246,0.1),rgba(59,130,246,0.1)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-blue-500 bg-[#030712] bg-[repeating-linear-gradient(-45deg,rgb(59,130,246),rgb(59,130,246)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-[#030712] z-1 border-blue-400 bg-[repeating-linear-gradient(-45deg,theme(colors.blue.400),theme(colors.blue.400)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-white/60 mt-1.5 block text-center text-sm">{label}</span>
    </div>
)