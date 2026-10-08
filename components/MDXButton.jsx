import Button from '@/components/Button'
import Link from '@/components/Link'

// Button renders the Link as its root element, so there is a single <a>.
const MDXButton = (props) => <Button as={Link} {...props} />

export default MDXButton
