package com.example.propertyapp.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.example.propertyapp.model.User;
import com.example.propertyapp.repository.UserRepository;
import com.example.propertyapp.security.CustomUserDetailsService;
import com.example.propertyapp.security.JwtAuthenticationFilter;
import com.example.propertyapp.security.JwtService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private BCryptPasswordEncoder passwordEncoder;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void register_shouldCreateUserWithoutReturningPasswordHash() throws Exception {
        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("mypassword")).thenReturn("hashed-password");

        User savedUser = new User();
        savedUser.setUserId(1L);
        savedUser.setUsername("john");
        savedUser.setEmail("john@example.com");
        savedUser.setPasswordHash("hashed-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"john\",\"email\":\"john@example.com\",\"password\":\"mypassword\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").doesNotExist())
            .andExpect(jsonPath("$.user.username").value("john"))
            .andExpect(jsonPath("$.user.email").value("john@example.com"))
            .andExpect(jsonPath("$.user.passwordHash").doesNotExist());
    }

    @Test
    void login_shouldVerifyPasswordAndReturnUserWithoutPasswordHash() throws Exception {
        User user = new User();
        user.setUserId(1L);
        user.setUsername("john");
        user.setEmail("john@example.com");
        user.setPasswordHash("hashed-password");

        when(userRepository.findByUsername("john")).thenReturn(user);
        when(passwordEncoder.matches("mypassword", "hashed-password")).thenReturn(true);

        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"john\",\"password\":\"mypassword\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.user.username").value("john"))
            .andExpect(jsonPath("$.user.passwordHash").doesNotExist());
    }
}
