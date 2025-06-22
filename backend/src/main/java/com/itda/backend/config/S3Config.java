package com.itda.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

import jakarta.annotation.PostConstruct;

@Configuration
public class S3Config {

    private final String bucketName = "itda-kangdy-s3";
    private S3Client s3Client;

    @Bean
    public S3Client s3Client() {
        this.s3Client = S3Client.builder()
                .region(Region.AP_NORTHEAST_3) // 오사카리전
                .credentialsProvider(DefaultCredentialsProvider.create()) // IAM 역할이면 이거면 Ok
                .build();
        return this.s3Client;
    }
    
    /**
     * 애플리케이션 시작 시 S3에 classes/ 폴더 생성
     */
    @PostConstruct
    public void initializeS3Folders() {
        try {
            System.out.println(">> [S3CONFIG] S3 폴더 구조 초기화 시작...");
            
            // classes/ 폴더가 없으면 생성
            createFolderIfNotExists("classes/");
            
            System.out.println(">> [S3CONFIG] S3 폴더 구조 초기화 완료!");
            
        } catch (Exception e) {
            System.err.println(">> [S3CONFIG ERROR] S3 폴더 초기화 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * S3에 폴더가 존재하지 않으면 생성하는 메서드
     */
    private void createFolderIfNotExists(String folderKey) {
        try {
            // 폴더 존재 여부 확인
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(folderKey)
                    .build();
            
            s3Client.headObject(headObjectRequest);
            System.out.println(">> [S3CONFIG] 폴더 이미 존재: " + folderKey);
            
        } catch (NoSuchKeyException e) {
            // 폴더가 없으면 생성
            System.out.println(">> [S3CONFIG] 폴더 생성 중: " + folderKey);
            
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(folderKey)
                    .contentLength(0L)
                    .build();
            
            s3Client.putObject(putObjectRequest, RequestBody.empty());
            System.out.println(">> [S3CONFIG] 폴더 생성 완료: " + folderKey);
            
        } catch (Exception e) {
            System.err.println(">> [S3CONFIG ERROR] 폴더 생성 실패: " + folderKey + ", 오류: " + e.getMessage());
        }
    }
}
