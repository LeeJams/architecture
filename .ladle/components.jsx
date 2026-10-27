import '../src/styles.css';
import { Providers } from '../src/App.jsx';
import { TechnologyDialog } from '../src/components/TechnologyDialog.jsx';
import { ZoomDialog } from '../src/components/References.jsx';
export const Provider = ({ children }) => <Providers>{children}<TechnologyDialog /><ZoomDialog /></Providers>;
