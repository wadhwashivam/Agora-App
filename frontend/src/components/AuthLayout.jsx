const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

import { Box, Typography } from "@mui/material";

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          width: "42%",
          maxWidth: 520,
          p: 7,
          borderRight: "2px solid",
          borderColor: "text.primary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
          <Typography sx={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600 }}>
            Agora
          </Typography>
          <Box
            sx={{ width: 6, height: 6, bgcolor: "primary.main", mb: "5px" }}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: SERIF,
              fontSize: 30,
              lineHeight: 1.45,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              maxWidth: "24ch",
              textWrap: "pretty",
            }}
          >
            A quieter place to think out loud — five hundred words at a time.
          </Typography>
          <Box sx={{ width: 44, height: 2, bgcolor: "primary.main", mt: 4 }} />
        </Box>
        <Typography
          sx={{ fontFamily: UI, fontSize: 13, color: "text.secondary" }}
        >
          No images. No video. Just argument.
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, sm: 6 },
          py: 8,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default AuthLayout;
