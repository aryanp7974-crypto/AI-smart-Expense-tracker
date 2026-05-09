package com.expense_tracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.http.*;
import java.util.Map;
import java.util.List;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String ask(String systemContext, String userQuestion) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system", "content", systemContext),
                        Map.of("role", "user", "content", userQuestion)
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            List choices = (List) response.getBody().get("choices");
            Map first = (Map) choices.get(0);
            Map message = (Map) first.get("message");
            return (String) message.get("content");
        } catch (HttpClientErrorException e) {
            System.out.println("Groq Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return "API error: " + e.getStatusCode();
        } catch (Exception e) {
            System.out.println("General Error: " + e.getMessage());
            return "Sorry, I couldn't process that right now.";
        }
    }
}