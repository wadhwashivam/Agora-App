import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Box, Button, Typography } from '@mui/material';

const UI = '"Work Sans", system-ui, sans-serif';

function PaginationControls({ page, hasMore, onPrev, onNext, disabled = false}){

    const canPrev = page > 1 && !disabled;
    const canNext = hasMore && !disabled;

    return (
        <Box sx={{ py: 3.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2}}>
            <Button onClick={onPrev} disabled = {!canPrev} startIcon = {<ArrowBackIcon sx={{ fontSize: 17 }} />} sx={{fontFamily: UI, fontSize: 14.5, textTransform: 'none', fontWeight: 500, px: 1.5, color: 'text.primary', '&:hover': { bgcolor: 'transparent', color: 'primary.main'}, '&.Mui-disabled': { color: 'text.disabled'}}}>
                Newer
            </Button>

            <Typography sx={{ ml: 1, fontFamily: UI,fontSize: 13, color: 'text.secondary', fontVariantNumeric: 'tabular-nums'}}>
                Page {page}
            </Typography>

            <Button onClick={onNext} disabled= {!canNext} endIcon={<ArrowForwardIcon sx={{fontSize: 17}} />} sx={{fontFamily: UI, fontSize: 14.5, textTransform: 'none', fontWeight: 500, px: 1.5, color: 'text.primary', '&:hover': { bgcolor: 'transparent', color: 'primary.main'}, '&.Mui-disabled': { color: 'text.disabled'}}}>
                Older
            </Button>
        </Box>
    );
}

export default PaginationControls;