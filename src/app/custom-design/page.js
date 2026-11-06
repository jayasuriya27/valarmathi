import PageHeader from '@/components/PageHeader'
import ProcessSteps from '@/components/ProcessSteps'
import CustomDesignForm from '@/components/CustomDesignForm'

export const metadata = {
  title: 'Custom Design',
  description: 'Get furniture and interiors made to your size, style and budget by Valarmathi Industries, Salem.',
}

export default function CustomDesign() {
  return (
    <>
      <PageHeader
        title="Custom design service"
        text="Every space is unique. Our bespoke design service ensures your furniture is too, thoughtfully tailored to fit your style, needs, and dimensions."
      />
      <ProcessSteps />
      <section className="mx-auto max-w-3xl px-5 pb-10">
        <h2 className="mb-4 font-display text-3xl text-ink">Tell us about your project</h2>
        <CustomDesignForm />
      </section>
    </>
  )
}
