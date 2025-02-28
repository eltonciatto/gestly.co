import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white shadow hover:bg-green-700",
        warning: "bg-yellow-600 text-white shadow hover:bg-yellow-700",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon: Icon, onClick, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        e.preventDefault();
        // Scroll to top first
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Then execute the click handler after a small delay
        setTimeout(onClick, 300);
      }
    };
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "opacity-70 pointer-events-none"
        )}
        ref={ref}
        disabled={props.disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {typeof children === 'string' ? 'Carregando...' : children}
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            {Icon && <Icon className="h-4 w-4" />}
            {children}
          </div>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }